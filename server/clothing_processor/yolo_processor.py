import torch
import numpy as np
from PIL import Image
import cv2
from pathlib import Path
import json
import colorsys

class YOLOClothingProcessor:
    def __init__(self, model_path, classes_path):
        """
        Initialize the YOLO clothing processor
        
        Args:
            model_path (str): Path to the YOLO model weights
            classes_path (str): Path to the classes file
        """
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model = self.load_model(model_path)
        self.classes = self.load_classes(classes_path)
        
    def load_model(self, model_path):
        """Load the YOLO model"""
        model = torch.hub.load('ultralytics/yolov5', 'custom', path=model_path)
        model.to(self.device)
        model.eval()
        return model
    
    def load_classes(self, classes_path):
        """Load class names from file"""
        with open(classes_path) as f:
            return [line.strip() for line in f.readlines()]
    
    def process_image(self, image_path):
        """
        Process an image and return clothing metadata
        
        Args:
            image_path (str): Path to the image file
            
        Returns:
            dict: Clothing metadata including category, colors, and description
        """
        # Load and preprocess image
        image = Image.open(image_path)
        
        # Run inference
        results = self.model(image)
        
        # Process results
        predictions = results.pandas().xyxy[0]
        if len(predictions) == 0:
            return None
        
        # Get the prediction with highest confidence
        best_pred = predictions.iloc[predictions['confidence'].argmax()]
        
        # Get category
        category = best_pred['name'].lower()
        
        # Extract colors
        img_cv = cv2.imread(str(image_path))
        img_cv = cv2.cvtColor(img_cv, cv2.COLOR_BGR2RGB)
        
        # Create mask from bounding box
        x1, y1, x2, y2 = map(int, [best_pred['xmin'], best_pred['ymin'], 
                                  best_pred['xmax'], best_pred['ymax']])
        mask = np.zeros(img_cv.shape[:2], dtype=np.uint8)
        mask[y1:y2, x1:x2] = 255
        
        # Extract dominant colors
        colors = self.extract_dominant_colors(img_cv, mask)
        
        # Generate description
        description = self.generate_description(category, colors)
        
        return {
            'category': category,
            'category_display': category.title(),
            'metadata': {
                'colors': colors,
                'description': description,
                'confidence': float(best_pred['confidence']),
                'bbox': [x1, y1, x2, y2]
            }
        }
    
    def extract_dominant_colors(self, image, mask, num_colors=3):
        """Extract dominant colors from the masked region of the image"""
        # Apply mask
        masked_img = cv2.bitwise_and(image, image, mask=mask)
        
        # Reshape the image to be a list of pixels
        pixels = masked_img[mask > 0].reshape(-1, 3)
        
        if len(pixels) == 0:
            return ['#000000']
        
        # Use k-means clustering to find dominant colors
        pixels = np.float32(pixels)
        criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 200, .1)
        flags = cv2.KMEANS_RANDOM_CENTERS
        _, labels, palette = cv2.kmeans(pixels, num_colors, None, criteria, 10, flags)
        
        # Convert colors to hex
        colors = []
        for color in palette:
            # Convert to HSV and adjust saturation and value
            h, s, v = colorsys.rgb_to_hsv(color[0]/255, color[1]/255, color[2]/255)
            s = min(1.0, s * 1.2)  # Increase saturation
            v = min(1.0, v * 1.2)  # Increase value
            r, g, b = [int(x * 255) for x in colorsys.hsv_to_rgb(h, s, v)]
            colors.append('#{:02x}{:02x}{:02x}'.format(r, g, b))
        
        return colors
    
    def generate_description(self, category, colors):
        """Generate a natural language description of the clothing item"""
        color_names = [self.get_color_name(color) for color in colors[:2]]
        
        if len(color_names) > 1:
            color_desc = f"{color_names[0]} and {color_names[1]}"
        else:
            color_desc = color_names[0]
        
        return f"A {color_desc} {category}"
    
    def get_color_name(self, hex_color):
        """Convert hex color to a human-readable name"""
        # Simple color name mapping - you can expand this
        basic_colors = {
            '#FF0000': 'red',
            '#00FF00': 'green',
            '#0000FF': 'blue',
            '#FFFF00': 'yellow',
            '#FF00FF': 'purple',
            '#00FFFF': 'cyan',
            '#000000': 'black',
            '#FFFFFF': 'white',
        }
        
        # Convert hex to RGB
        hex_color = hex_color.lstrip('#')
        r, g, b = tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
        
        # Find the closest basic color
        min_distance = float('inf')
        closest_color = 'unknown'
        
        for hex_basic, name in basic_colors.items():
            hex_basic = hex_basic.lstrip('#')
            r2, g2, b2 = tuple(int(hex_basic[i:i+2], 16) for i in (0, 2, 4))
            
            distance = ((r - r2) ** 2 + (g - g2) ** 2 + (b - b2) ** 2) ** 0.5
            
            if distance < min_distance:
                min_distance = distance
                closest_color = name
        
        return closest_color 
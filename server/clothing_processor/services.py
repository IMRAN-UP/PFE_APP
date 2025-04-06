import os
import logging
import traceback
from django.conf import settings
from .clothing_segmentation import ClothingSegmenter

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(os.path.join(settings.BASE_DIR, "clothing_segmentation.log")),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class ClothingProcessorService:
    def __init__(self):
        """Initialize the clothing processor service."""
        logger.info("Initializing ClothingProcessorService")
        
        # Use absolute path to the model file
        model_path = os.path.abspath(os.path.join(settings.BASE_DIR, 'server', 'models', 'best.pt'))
        logger.info(f"Model path: {model_path}")
        
        # Check if the model file exists
        if not os.path.exists(model_path):
            logger.error(f"Model file not found at: {model_path}")
            raise FileNotFoundError(f"Model file not found at: {model_path}")
        
        self.output_dir = os.path.join(settings.MEDIA_ROOT, 'processed_clothes')
        os.makedirs(self.output_dir, exist_ok=True)
        logger.info(f"Output directory: {self.output_dir}")
        
        try:
            logger.info("Initializing ClothingSegmenter")
            self.segmenter = ClothingSegmenter(model_path, self.output_dir)
            logger.info("ClothingSegmenter initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize ClothingSegmenter: {str(e)}")
            logger.error(traceback.format_exc())
            raise

    def process_clothing_item(self, image_path, index=0):
        """
        Process a single clothing item image.
        
        Args:
            image_path (str): Path to the image file
            index (int): Index for the output filename
            
        Returns:
            dict: Processing results including segmented image path and metadata
        """
        try:
            # Process the image using the segmenter
            self.segmenter.process_image(image_path, index)
            
            # Get the base filename without extension
            base_name = f"{index:02d}"
            
            # Look for the generated files
            segmented_files = []
            metadata_files = []
            
            # Check for both dress and other clothing items
            for suffix in ['_dress', '_0', '_1', '_2']:
                seg_path = os.path.join(self.output_dir, f"{base_name}{suffix}.jpg")
                meta_path = os.path.join(self.output_dir, f"{base_name}{suffix}.json")
                
                if os.path.exists(seg_path) and os.path.exists(meta_path):
                    segmented_files.append(seg_path)
                    metadata_files.append(meta_path)
            
            if not segmented_files or not metadata_files:
                logger.error("No segmented images or metadata files were generated")
                return None
            
            # For now, we'll just use the first segmented item
            # In the future, you might want to handle multiple items differently
            with open(metadata_files[0], 'r') as f:
                import json
                metadata = json.load(f)
            
            # Update the metadata with the actual file paths
            result = {
                'original_image': image_path,
                'segmented_image': segmented_files[0],
                'category': metadata.get('category', ''),
                'metadata': {
                    'colors': metadata.get('colors', []),
                    'description': metadata.get('description', ''),
                }
            }
            
            logger.info(f"Successfully processed clothing item: {result}")
            return result
            
        except Exception as e:
            logger.error(f"Error processing clothing item: {str(e)}")
            return None 
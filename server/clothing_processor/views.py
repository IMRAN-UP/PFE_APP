from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import os
from .services import ClothingProcessorService
import logging
import traceback
from django.conf import settings

logger = logging.getLogger(__name__)

# Initialize the clothing processor service
try:
    logger.info("Starting clothing processor initialization")
    clothing_processor = ClothingProcessorService()
    logger.info("Clothing processor initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize ClothingProcessorService: {str(e)}")
    logger.error(traceback.format_exc())
    clothing_processor = None

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def process_clothing(request):
    """
    Process a clothing item image.
    Expects a multipart form with an 'image' file.
    Returns the processing results including segmented image and metadata.
    """
    logger.info("Received clothing processing request")
    
    if not clothing_processor:
        logger.error("Clothing processor service is not available")
        return Response(
            {'error': 'Clothing processor service is not available. Please try again later.'},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
    
    if 'image' not in request.FILES:
        logger.error("No image file provided")
        return Response(
            {'error': 'No image file provided'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        image_file = request.FILES['image']
        logger.info(f"Processing image: {image_file.name}")
        
        # Save the uploaded file temporarily
        temp_dir = os.path.join(settings.MEDIA_ROOT, 'temp')
        os.makedirs(temp_dir, exist_ok=True)
        temp_path = os.path.join(temp_dir, image_file.name)
        
        logger.info(f"Saving uploaded file to: {temp_path}")
        with open(temp_path, 'wb+') as destination:
            for chunk in image_file.chunks():
                destination.write(chunk)
        
        # Process the image
        logger.info("Processing image with clothing processor")
        result = clothing_processor.process_clothing_item(temp_path)
        
        if not result:
            logger.error("Image processing failed")
            return Response(
                {'error': 'Failed to process the image'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        # Check if the model successfully classified the clothing
        if not result.get('category') or result['category'] == 'unknown':
            logger.error("Could not identify the clothing item")
            return Response(
                {'error': 'Could not identify the clothing item. Please try a clearer image.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Clean up the temporary file
        if os.path.exists(temp_path):
            os.remove(temp_path)
            logger.info(f"Removed temporary file: {temp_path}")
        
        logger.info("Returning processing results")
        return Response({
            'category': result['category'],
            'metadata': {
                'colors': result['metadata']['colors'],
                'description': result['metadata']['description']
            },
            'segmented_image_url': result['segmented_image']
        })
        
    except Exception as e:
        logger.error(f"Error processing clothing: {str(e)}")
        logger.error(traceback.format_exc())
        
        # Clean up the temporary file if it exists
        if 'temp_path' in locals() and os.path.exists(temp_path):
            os.remove(temp_path)
            logger.info(f"Removed temporary file after error: {temp_path}")
            
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

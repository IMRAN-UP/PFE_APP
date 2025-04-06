from django.shortcuts import render
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import ClothingItem
from .serializers import ClothingItemSerializer, ClothingItemCreateSerializer
import os
from django.conf import settings

# Create your views here.

class ClothingItemViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing clothing items.
    """
    serializer_class = ClothingItemSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """
        This view should return a list of all clothing items
        for the currently authenticated user.
        """
        return ClothingItem.objects.filter(user=self.request.user).order_by('-created_at')
    
    def get_serializer_class(self):
        """
        Return appropriate serializer class
        """
        if self.action == 'create' or self.action == 'update':
            return ClothingItemCreateSerializer
        return ClothingItemSerializer
    
    def perform_create(self, serializer):
        """
        Save the clothing item with the current user.
        """
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def update_segmented_image(self, request, pk=None):
        """
        Update the segmented image for a clothing item.
        """
        clothing_item = self.get_object()
        
        if 'segmented_image' not in request.FILES:
            return Response(
                {'error': 'No segmented image provided'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Delete the old segmented image if it exists
        if clothing_item.segmented_image:
            if os.path.isfile(clothing_item.segmented_image.path):
                os.remove(clothing_item.segmented_image.path)
        
        # Update the segmented image
        clothing_item.segmented_image = request.FILES['segmented_image']
        clothing_item.save()
        
        return Response(
            ClothingItemSerializer(clothing_item).data,
            status=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['post'])
    def update_metadata(self, request, pk=None):
        """
        Update the metadata for a clothing item.
        """
        clothing_item = self.get_object()
        
        if 'metadata' not in request.data:
            return Response(
                {'error': 'No metadata provided'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate the metadata
        serializer = ClothingItemCreateSerializer(
            clothing_item, 
            data={'metadata': request.data['metadata']}, 
            partial=True
        )
        
        if serializer.is_valid():
            clothing_item.set_metadata(request.data['metadata'])
            return Response(
                ClothingItemSerializer(clothing_item).data,
                status=status.HTTP_200_OK
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def categories(self, request):
        """
        Return a list of all available clothing categories.
        """
        categories = [{'value': choice[0], 'label': choice[1]} for choice in ClothingItem.CATEGORY_CHOICES]
        return Response(categories)

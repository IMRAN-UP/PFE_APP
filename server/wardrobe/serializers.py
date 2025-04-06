from rest_framework import serializers
from .models import ClothingItem
from django.conf import settings

class ClothingItemSerializer(serializers.ModelSerializer):
    original_image_url = serializers.SerializerMethodField()
    segmented_image_url = serializers.SerializerMethodField()

    class Meta:
        model = ClothingItem
        fields = ['id', 'name', 'category', 'original_image', 'original_image_url', 'segmented_image', 'segmented_image_url', 'metadata', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_original_image_url(self, obj):
        if obj.original_image:
            return self.context['request'].build_absolute_uri(obj.original_image.url)
        return None

    def get_segmented_image_url(self, obj):
        if obj.segmented_image:
            return self.context['request'].build_absolute_uri(obj.segmented_image.url)
        return None
    
    def to_representation(self, instance):
        """Convert the instance to a dictionary for API responses"""
        representation = super().to_representation(instance)
        # Add the category display name
        representation['category_display'] = instance.get_category_display()
        return representation

class ClothingItemCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClothingItem
        fields = ['name', 'category', 'original_image', 'segmented_image', 'metadata']
    
    def validate_metadata(self, value):
        """Validate the metadata field"""
        if not isinstance(value, dict):
            raise serializers.ValidationError("Metadata must be a dictionary")
        
        # Check for required fields in metadata
        required_fields = ['colors', 'description']
        for field in required_fields:
            if field not in value:
                raise serializers.ValidationError(f"Metadata must contain '{field}' field")
        
        # Validate colors field
        if not isinstance(value.get('colors'), list):
            raise serializers.ValidationError("Colors must be a list")
        
        # Validate description field
        if not isinstance(value.get('description'), str):
            raise serializers.ValidationError("Description must be a string")
        
        return value 
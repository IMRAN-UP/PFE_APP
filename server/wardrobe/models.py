from django.db import models
from django.conf import settings
import json

class ClothingItem(models.Model):
    CATEGORY_CHOICES = [
        ('upper', 'Upper Clothing'),
        ('lower', 'Lower Clothing'),
        ('dress', 'Dress'),
        ('outerwear', 'Outerwear'),
        ('shoes', 'Shoes'),
        ('accessories', 'Accessories'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='clothing_items')
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    original_image = models.ImageField(upload_to='clothes/original/')
    segmented_image = models.ImageField(upload_to='clothes/segmented/', null=True, blank=True)
    metadata = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} - {self.get_category_display()}"
    
    def set_metadata(self, metadata_dict):
        """Set the metadata for the clothing item"""
        self.metadata = metadata_dict
        self.save()
    
    def get_metadata(self):
        """Get the metadata for the clothing item"""
        return self.metadata
    
    def get_colors(self):
        """Get the colors from the metadata"""
        return self.metadata.get('colors', [])
    
    def get_description(self):
        """Get the description from the metadata"""
        return self.metadata.get('description', '')

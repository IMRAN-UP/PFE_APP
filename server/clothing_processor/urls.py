from django.urls import path
from . import views

urlpatterns = [
    path('process/', views.process_clothing, name='process_clothing'),
] 
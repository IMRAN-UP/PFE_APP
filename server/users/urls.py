from django.urls import path
from .views import register_view, login_view, token_refresh_view

urlpatterns = [
    path('register/', register_view, name='register'),
    path('login/', login_view, name='login'),
    path('token/refresh/', token_refresh_view, name='token_refresh'),
]

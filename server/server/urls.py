from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('wardrobe/', include('wardrobe.urls')),
    path('users/', include('users.urls')),
    path('clothing-processor/', include('clothing_processor.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) 
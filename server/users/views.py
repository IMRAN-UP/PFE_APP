from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password, check_password
from django.core.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
import json
from .models import User
import uuid
import traceback

@csrf_exempt
def register_view(request):
    if request.method == 'POST':
        try:
            # Handle FormData instead of JSON
            first_name = request.POST.get('first_name')
            last_name = request.POST.get('last_name')
            email = request.POST.get('email')
            password = request.POST.get('password')
            gender = request.POST.get('gender')
            birthday = request.POST.get('birthday')
            phone_number = request.POST.get('phone_number')
            
            # Handle file upload
            profile_image = request.FILES.get('profile_image')
            
            # Validate required fields
            if not all([first_name, last_name, email, password, gender, birthday]):
                return JsonResponse({'error': 'All required fields must be provided'}, status=400)

            # Check if email already exists
            if User.objects.filter(email=email).exists():
                return JsonResponse({'error': 'Email already exists'}, status=400)

            # Generate a unique username from email
            username = email.split('@')[0]
            # If username already exists, append a random string
            if User.objects.filter(username=username).exists():
                username = f"{username}_{uuid.uuid4().hex[:8]}"

            # Ensure gender is a single character
            if gender and len(gender) > 1:
                gender = gender[0].upper()  # Take only the first character and make it uppercase
            
            # Validate gender
            if gender not in ['M', 'F']:
                return JsonResponse({'error': "Gender must be either 'M' or 'F'"}, status=400)

            # Create the user instance with all fields
            user = User(
                username=username,
                first_name=first_name,
                last_name=last_name,
                email=email,
                gender=gender,
                birthday=birthday,
                phone_number=phone_number,
                is_active=True,
                is_staff=False,
                is_superuser=False
            )
            
            # Handle profile image if provided
            if profile_image:
                # Save the file to a specific directory
                import os
                from django.conf import settings
                
                # Create media directory if it doesn't exist
                media_root = os.path.join(settings.BASE_DIR, 'media', 'profile_images')
                os.makedirs(media_root, exist_ok=True)
                
                # Generate a unique filename
                file_extension = os.path.splitext(profile_image.name)[1]
                filename = f"{username}_{uuid.uuid4().hex[:8]}{file_extension}"
                file_path = os.path.join('profile_images', filename)
                
                # Save the file
                with open(os.path.join(media_root, filename), 'wb+') as destination:
                    for chunk in profile_image.chunks():
                        destination.write(chunk)
                
                # Save the path to the database
                user.photo_path = file_path
            
            user.set_password(password)
            user.save()
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            
            # Return user data and tokens
            user_data = {
                'id': user.id,
                'username': user.username or f"{user.first_name} {user.last_name}",
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'gender': user.gender,
                'phone_number': user.phone_number,
                'photo_path': user.photo_path
            }
            
            return JsonResponse({
                'message': 'User registered successfully',
                'user': user_data,
                'tokens': {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh)
                }
            }, status=201)
            
        except ValidationError as e:
            return JsonResponse({'error': str(e)}, status=400)
        except Exception as e:
            # Log the full traceback for debugging
            print(f"Registration error: {str(e)}")
            print(traceback.format_exc())
            return JsonResponse({'error': f'Registration failed: {str(e)}'}, status=500)

    return JsonResponse({'error': 'Invalid request'}, status=400)

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')

        try:
            user = User.objects.get(email=email)
            if check_password(password, user.password):
                # Update last login
                user.last_login = timezone.now()
                user.save(update_fields=['last_login'])
                
                # Generate JWT tokens
                refresh = RefreshToken.for_user(user)
                
                # Return user data and tokens
                user_data = {
                    'id': user.id,
                    'username': user.username or f"{user.first_name} {user.last_name}",
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'gender': user.gender,
                    'phone_number': user.phone_number,
                    'photo_path': user.photo_path
                }
                
                return JsonResponse({
                    'message': 'success',
                    'user': user_data,
                    'tokens': {
                        'access': str(refresh.access_token),
                        'refresh': str(refresh)
                    }
                }, status=200)
            else:
                return JsonResponse({'error': 'Invalid credentials'}, status=400)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=400)

    return JsonResponse({'error': 'Invalid request'}, status=400)

@csrf_exempt
def token_refresh_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            refresh_token = data.get('refresh')
            
            if not refresh_token:
                return JsonResponse({'error': 'Refresh token is required'}, status=400)
                
            # Create a new access token from the refresh token
            refresh = RefreshToken(refresh_token)
            
            return JsonResponse({
                'access': str(refresh.access_token)
            }, status=200)
            
        except Exception as e:
            return JsonResponse({'error': f'Token refresh failed: {str(e)}'}, status=400)
            
    return JsonResponse({'error': 'Invalid request'}, status=400)

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password, check_password
import json
from .models import User

@csrf_exempt
def register_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        email = data.get('email')
        password = data.get('password')
        gender = data.get('gender')
        birthday = data.get('birthday')  # Get the birthday from the request

        if User.objects.filter(email=email).exists():
            return JsonResponse({'error': 'Email already exists'}, status=400)

        # Create the user instance with the birthday included
        user = User(
            first_name=first_name,
            last_name=last_name,
            email=email,
            gender=gender,
            password=make_password(password),
            birthday=birthday  # Save the birthday in the user instance
        )
        user.save()
        return JsonResponse({'message': 'User registered successfully'}, status=201)

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
                return JsonResponse({'message': 'Login successful', 'user_id': user.id}, status=200)
            else:
                return JsonResponse({'error': 'Invalid credentials'}, status=400)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=400)

    return JsonResponse({'error': 'Invalid request'}, status=400)

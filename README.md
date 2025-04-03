# Smart Wardrobe Application

Smart Wardrobe is a modern web application that helps users manage their clothing inventory, get outfit recommendations, and organize their wardrobe digitally.

## Project Structure

The project is organized into two main directories:

- `client/`: Frontend React application
- `server/`: Backend Django REST API

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **Python** (v3.8 or higher)
- **pip** (Python package manager)
- **PostgreSQL** (v12 or higher)

## Getting Started

### Backend Setup (Server)

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Create and activate a virtual environment:
   ```bash
   # On Windows
   python -m venv venv
   venv\Scripts\activate

   # On macOS/Linux
   python -m venv venv
   source venv/bin/activate
   ```

3. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   Create a `.env` file in the server directory with the following variables:
   ```
   DEBUG=True
   SECRET_KEY=your_secret_key_here
   DATABASE_URL=postgres://username:password@localhost:5432/smart_wardrobe
   ALLOWED_HOSTS=localhost,127.0.0.1
   CORS_ALLOWED_ORIGINS=http://localhost:3000
   ```

5. Set up the database:
   ```bash
   python manage.py migrate
   ```

6. Create a superuser (admin):
   ```bash
   python manage.py createsuperuser
   ```

7. Run the development server:
   ```bash
   python manage.py runserver
   ```

   The API will be available at `http://localhost:8000/`

### Frontend Setup (Client)

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install the required npm packages:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the client directory with the following variables:
   ```
   REACT_APP_API_URL=http://localhost:8000
   ```

4. Start the development server:
   ```bash
   npm start
   ```

   The application will be available at `http://localhost:3000/`

## Features

- **User Authentication**: Register, login, and manage user profiles
- **Wardrobe Management**: Add, edit, and delete clothing items
- **Outfit Recommendations**: Get personalized outfit suggestions based on your wardrobe
- **Responsive Design**: Works on desktop and mobile devices

## API Documentation

The API documentation is available at `http://localhost:8000/api/docs/` when running the server.

## Project Structure Details

### Backend (Server)

- `users/`: User authentication and profile management
- `wardrobe/`: Clothing and outfit management
- `recommendations/`: Outfit recommendation algorithms
- `utils/`: Utility functions and helpers

### Frontend (Client)

- `src/components/`: React components
  - `auth/`: Authentication components (Login, Register)
  - `dashboard/`: Dashboard components
  - `wardrobe/`: Wardrobe management components
  - `common/`: Shared components
- `src/utils/`: Utility functions
- `src/context/`: React context providers
- `src/hooks/`: Custom React hooks
- `src/assets/`: Static assets (images, icons)

## Deployment

### Backend Deployment

1. Set up a production server (e.g., AWS, DigitalOcean, Heroku)
2. Configure environment variables for production
3. Set up a production database
4. Deploy using:
   ```bash
   python manage.py collectstatic
   gunicorn smart_wardrobe.wsgi:application
   ```

### Frontend Deployment

1. Build the production version:
   ```bash
   npm run build
   ```
2. Deploy the `build` directory to a static hosting service (e.g., Netlify, Vercel, AWS S3)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any questions or issues, please open an issue in the GitHub repository. 
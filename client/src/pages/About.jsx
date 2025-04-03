import { Link } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

const About = () => {
  const authenticated = isAuthenticated();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-primary">
                Smart Wardrobe
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {authenticated ? (
                <Link
                  to="/dashboard"
                  className="btn-primary"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/auth"
                    className="btn-secondary"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            About Smart Wardrobe
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            Your personal wardrobe management solution
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
              <p className="mt-4 text-gray-500">
                Smart Wardrobe is designed to help you organize and manage your clothing collection efficiently. 
                We believe that everyone deserves a well-organized wardrobe that makes getting dressed easier 
                and more enjoyable.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">What We Offer</h2>
              <ul className="mt-4 space-y-4 text-gray-500">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Digital inventory of your entire wardrobe</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Smart outfit suggestions based on occasion and weather</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Seasonal wardrobe planning and organization</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Style tracking and outfit history</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Ready to transform your wardrobe?
          </h2>
          <p className="mt-4 text-xl text-gray-500">
            Join thousands of users who have already organized their wardrobe with Smart Wardrobe.
          </p>
          <div className="mt-8">
            <Link
              to={authenticated ? "/dashboard" : "/register"}
              className="btn-primary inline-flex items-center px-6 py-3 text-base font-medium"
            >
              {authenticated ? "Go to Dashboard" : "Get Started"}
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-16">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <nav className="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
            <div className="px-5 py-2">
              <Link to="/about" className="nav-link">
                About
              </Link>
            </div>
            <div className="px-5 py-2">
              <Link to="#features" className="nav-link">
                Features
              </Link>
            </div>
            <div className="px-5 py-2">
              <Link to="#privacy" className="nav-link">
                Privacy
              </Link>
            </div>
            <div className="px-5 py-2">
              <Link to="#terms" className="nav-link">
                Terms
              </Link>
            </div>
          </nav>
          <p className="mt-8 text-center text-base text-gray-400">
            &copy; 2024 Smart Wardrobe. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default About; 
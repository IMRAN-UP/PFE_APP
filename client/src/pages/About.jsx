import { Link } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';
import { useTheme } from '../context/ThemeContext';

const About = () => {
  const authenticated = isAuthenticated();
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-primary dark:text-primary-light">
                Smart Wardrobe
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle Button */}
              <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
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
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
            About Smart Wardrobe
          </h1>
          <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
            Your personal wardrobe management solution
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Smart Wardrobe is dedicated to helping you organize and manage your clothing collection efficiently. 
                We believe that a well-organized wardrobe leads to better style choices and a more sustainable approach to fashion.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Key Features</h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-primary dark:text-primary-light mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-300">Digital wardrobe inventory</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-primary dark:text-primary-light mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-300">Smart outfit suggestions</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-primary dark:text-primary-light mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-300">Style tracking and outfit history</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Ready to transform your wardrobe?
          </h2>
          <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
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
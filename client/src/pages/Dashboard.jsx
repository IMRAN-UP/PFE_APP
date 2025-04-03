import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserData, logout } from '../utils/auth';
import { useTheme } from '../context/ThemeContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { isDarkMode, toggleDarkMode } = useTheme();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserData();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Get the API URL from environment or use default
  const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
  
  // Construct the profile image URL if it exists
  const profileImageUrl = userData?.photo_path 
    ? `${apiUrl}/media/${userData.photo_path}` 
    : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white dark:bg-gray-800 shadow-md transition-all duration-300 ease-in-out fixed h-screen`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 flex items-center justify-between">
            {sidebarOpen && <span className="text-xl font-bold text-primary dark:text-primary-light">Smart Wardrobe</span>}
            <button 
              onClick={toggleSidebar}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          
          {/* Profile Section */}
          <div className="flex flex-col items-center p-4 border-b border-gray-200 dark:border-gray-700">
            {profileImageUrl ? (
              <img 
                src={profileImageUrl} 
                alt="Profile" 
                className="h-16 w-16 rounded-full object-cover border-2 border-primary dark:border-primary-light"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center border-2 border-primary dark:border-primary-light">
                <span className="text-primary dark:text-primary-light text-xl font-bold">
                  {userData?.first_name?.charAt(0)}{userData?.last_name?.charAt(0)}
                </span>
              </div>
            )}
            {sidebarOpen && (
              <div className="mt-2 text-center">
                <p className="font-medium text-gray-800 dark:text-gray-200">{userData?.first_name} {userData?.last_name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{userData?.email}</p>
              </div>
            )}
          </div>
          
          {/* Navigation Links */}
          <div className="flex-1 py-4">
            <nav className="space-y-2 px-2">
              {/* Outfit Generation Button */}
              <button className="w-full flex items-center p-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary dark:text-primary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {sidebarOpen && <span className="ml-3">Outfit Generation</span>}
              </button>
              
              {/* Wardrobe Button */}
              <button className="w-full flex items-center p-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary dark:text-primary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                {sidebarOpen && <span className="ml-3">Wardrobe</span>}
              </button>
            </nav>
          </div>
          
          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center p-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {sidebarOpen && <span className="ml-3">Logout</span>}
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-16'} transition-all duration-300 ease-in-out`}>
        {/* Top Navigation */}
        <nav className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-primary dark:text-primary-light">Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-500 dark:text-gray-400">Welcome, {userData?.first_name}!</span>
                
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
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* User Profile */}
          <div className="card mb-8 bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <div className="card-header p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Profile Information</h2>
            </div>
            <div className="card-body p-4">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Profile Image */}
                <div className="flex flex-col items-center md:w-1/3">
                  {profileImageUrl ? (
                    <img 
                      src={profileImageUrl} 
                      alt="Profile" 
                      className="h-40 w-40 rounded-full object-cover border-4 border-primary dark:border-primary-light mb-4"
                    />
                  ) : (
                    <div className="h-40 w-40 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center border-4 border-primary dark:border-primary-light mb-4">
                      <span className="text-primary dark:text-primary-light text-4xl font-bold">
                        {userData?.first_name?.charAt(0)}{userData?.last_name?.charAt(0)}
                      </span>
                    </div>
                  )}
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{userData?.first_name} {userData?.last_name}</h3>
                  <p className="text-gray-500 dark:text-gray-400">{userData?.email}</p>
                </div>
                
                {/* User Details */}
                <div className="md:w-2/3">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</p>
                      <p className="mt-1 text-lg text-gray-800 dark:text-gray-200">{userData?.first_name} {userData?.last_name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</p>
                      <p className="mt-1 text-lg text-gray-800 dark:text-gray-200">{userData?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Gender</p>
                      <p className="mt-1 text-lg text-gray-800 dark:text-gray-200">{userData?.gender === 'M' ? 'Male' : 'Female'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone Number</p>
                      <p className="mt-1 text-lg text-gray-800 dark:text-gray-200">{userData?.phone_number || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Inventory Card */}
            <div className="card bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
              <div className="card-header p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Inventory</h3>
              </div>
              <div className="card-body p-4">
                <p className="text-3xl font-bold text-primary dark:text-primary-light">0</p>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Total Items</p>
                <button className="mt-4 btn-primary w-full">
                  View Inventory
                </button>
              </div>
            </div>

            {/* Outfits Card */}
            <div className="card bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
              <div className="card-header p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Outfits</h3>
              </div>
              <div className="card-body p-4">
                <p className="text-3xl font-bold text-primary dark:text-primary-light">0</p>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Created Outfits</p>
                <button className="mt-4 btn-primary w-full">
                  View Outfits
                </button>
              </div>
            </div>

            {/* Favorites Card */}
            <div className="card bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
              <div className="card-header p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Favorites</h3>
              </div>
              <div className="card-body p-4">
                <p className="text-3xl font-bold text-primary dark:text-primary-light">0</p>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Favorite Items</p>
                <button className="mt-4 btn-primary w-full">
                  View Favorites
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Quick Actions</h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <button className="btn-primary">
                Add New Item
              </button>
              <button className="btn-secondary">
                Create Outfit
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
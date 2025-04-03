import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserData, logout } from '../utils/auth';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-primary">Smart Wardrobe</span>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="btn-secondary"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* User Profile */}
        <div className="card mb-8">
          <div className="card-header">
            <h2 className="text-xl font-semibold">Profile Information</h2>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-gray-500">Full Name</p>
                <p className="mt-1 text-lg">{userData?.first_name} {userData?.last_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="mt-1 text-lg">{userData?.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Gender</p>
                <p className="mt-1 text-lg">{userData?.gender === 'M' ? 'Male' : 'Female'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Phone Number</p>
                <p className="mt-1 text-lg">{userData?.phone_number || 'Not provided'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Inventory Card */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold">Inventory</h3>
            </div>
            <div className="card-body">
              <p className="text-3xl font-bold text-primary">0</p>
              <p className="mt-2 text-sm text-gray-500">Total Items</p>
              <button className="mt-4 btn-primary w-full">
                View Inventory
              </button>
            </div>
          </div>

          {/* Outfits Card */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold">Outfits</h3>
            </div>
            <div className="card-body">
              <p className="text-3xl font-bold text-primary">0</p>
              <p className="mt-2 text-sm text-gray-500">Created Outfits</p>
              <button className="mt-4 btn-primary w-full">
                View Outfits
              </button>
            </div>
          </div>

          {/* Favorites Card */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold">Favorites</h3>
            </div>
            <div className="card-body">
              <p className="text-3xl font-bold text-primary">0</p>
              <p className="mt-2 text-sm text-gray-500">Favorite Items</p>
              <button className="mt-4 btn-primary w-full">
                View Favorites
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
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
  );
};

export default Dashboard; 
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import userService from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import { User } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔍 Debug Profile fetch:');
      console.log('- Is authenticated:', authUser ? 'Yes' : 'No');
      console.log('- Auth user:', authUser);
      console.log('- Token in localStorage:', localStorage.getItem('accessToken') ? 'Present' : 'Missing');
      
      if (!localStorage.getItem('accessToken')) {
        throw new Error('No authentication token found. Please login again.');
      }
      
      const response = await userService.getProfile();
      console.log('✅ Profile data received:', response);
      
      setUserProfile(response.user || response);
    } catch (error) {
      console.error('❌ Error fetching user data:', error);
      
      if (error.status === 401) {
        setError('Authentication failed. Please login again.');
      } else {
        setError(error.message || 'Failed to load profile data');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const displayUser = userProfile || authUser;

  if (isLoading) {
    return (
      <div className="w-full bg-white min-h-screen">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white min-h-screen">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-red-500 mb-4">Error loading profile</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchUserData} className="bg-blue-500 text-white px-4 py-2 rounded">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white">
      {/* Cover Image */}
      <div className="relative w-full h-[450px]">
        <img src="/images/img__1.png" alt="Cover" className="object-cover w-full h-full" />
      </div>

      {/* Profile Info Section */}
      <div className="relative px-6 pt-2 pb-6 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            {/* Avatar + Info */}
            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              {/* Avatar */}
              <div className="relative -mt-20">
                {displayUser?.profile_image ? (
                  <img
                    src={displayUser.profile_image}
                    alt="Avatar"
                    className="object-cover w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center w-32 h-32 bg-gray-200 rounded-full border-4 border-white shadow-lg">
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                {/* Fallback avatar */}
                <div className="hidden items-center justify-center w-32 h-32 bg-gray-200 rounded-full border-4 border-white shadow-lg">
                  <User className="w-16 h-16 text-gray-400" />
                </div>
              </div>

              {/* User Info */}
              <div className="md:mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {displayUser?.full_name || 'User Name'}
                  </h1>
                </div>
                
                <p className="mb-2 text-gray-600">
                  @{displayUser?.email?.split('@')[0] || 'username'}
                </p>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                  <span>{displayUser?.email || 'No email'}</span>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <div className="flex gap-3 items-center mt-4 md:mt-0">
              <Link to="/profile/edit">
                <Button className="px-6 py-2 font-medium text-white bg-blue-500 rounded-md transition-colors hover:bg-blue-600">
                  Edit information
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

    

      {/* Supported Projects Section */}
      <div className="py-16 bg-gray-50">
        <div className="px-6 mx-auto max-w-7xl">
        

          {/* Projects Grid - Coming soon */}
          <div className="py-16 text-center">
            <div className="mx-auto max-w-md">
              <div className="flex justify-center items-center mx-auto mb-6 w-24 h-24 bg-gray-200 rounded-full">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">No projects yet</h3>
              <p className="mb-8 text-gray-600">
                You haven't supported any campaigns yet. Start making a difference today!
              </p>
            </div>
          </div>

          {/* Explore Button */}
          <div className="flex justify-center items-center text-center">
            <Link to="/campaigns">
              <Button className="px-8 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow-md transition-colors hover:bg-blue-700">
                Explore fundraising campaigns
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

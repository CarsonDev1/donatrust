import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import ProjectCard from './ProjectCard';
import userService from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import { Newspaper, Rss, Share2, Upload, User } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [userProfile, setUserProfile] = useState(null);

  console.log(userProfile);

  const fetchUserData = async () => {
    try {
      const profileResponse = await userService.getProfile();
      setUserProfile(profileResponse.user || profileResponse);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Fallback to auth user if profile isn't loaded yet
  const displayUser = userProfile || authUser;

  return (
    <div className="w-full bg-white">
      {/* Cover Image */}
      <div className="relative w-full h-[450px]">
        <img src="/images/img__1.png" alt="Cover" className="object-cover w-full h-full" />
        {/* Edit Cover Button */}
        <button className="flex absolute right-4 bottom-4 justify-center items-center w-10 h-10 rounded-full transition-colors hover:bg-white">
          <img src="/images/img_24_user_interface_image.svg" alt="Edit cover" className="size-8" />
        </button>
      </div>

      {/* Profile Info Section */}
      <div className="relative px-6 pt-2 pb-6 md:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            {/* Avatar + Info */}
            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              {/* Avatar */}
              <div className="relative -mt-20">
                {displayUser?.avatar ? (
                  <img
                    src={displayUser?.avatar}
                    alt="Avatar"
                    className="object-cover w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg"
                  />
                ) : (
                  <User className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg" />
                )}
                {/* Edit avatar icon */}
                <button className="flex absolute right-0 bottom-0 justify-center items-center w-8 h-8 text-gray-500">
                  <Upload className="size-6" />
                </button>
              </div>

              {/* User Info */}
              <div className="md:mb-4">
                <h1 className="mb-1 text-2xl font-bold text-gray-900">
                  {displayUser?.full_name || 'User Name'}
                </h1>
                <p className="mb-2 text-gray-600">
                  @{displayUser?.email?.split('@')[0] || 'username'}
                </p>
                <div className="flex gap-3 text-sm text-gray-500">
                  <div className="flex gap-2 items-center">
                    <Rss className="size-4" />
                    <span>0 followers</span>
                  </div>
                  <span className="text-gray-500">|</span>
                  <div className="flex gap-2 items-center">
                    <Newspaper className="size-4" />
                    <span>0 article</span>
                  </div>
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

              {/* Share button */}
              <button className="p-2 text-gray-500 rounded-md transition-colors hover:text-gray-700 bg-green-300/40">
                <Share2 className="size-6 text-green-800/40" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      {/* <div className="py-8 border-t border-gray-200">
        <div className="px-6 mx-auto max-w-4xl">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Project</p>
              <p className="text-2xl font-bold text-pink-500">{supportedCampaigns.length || 0}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Organization</p>
              <p className="text-2xl font-bold text-pink-500">{userStats?.organizations || 0}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Amount of donation</p>
              <p className="text-2xl font-bold text-pink-500">
                {userStats?.totalAmount
                  ? `${new Intl.NumberFormat('vi-VN').format(userStats.totalAmount)} VND`
                  : '0 VND'}
              </p>
            </div>
          </div>
        </div>
      </div> */}

      {/* Supported Projects Section */}
      <div className="py-16 bg-gray-50">
        <div className="px-6 mx-auto max-w-7xl">
          {/* Section Title */}
          <h2 className="mb-12 text-3xl font-bold text-center text-gray-900 md:text-4xl">
            The project has supported
          </h2>

          {/* Projects Grid */}
          {/* {supportedCampaigns && supportedCampaigns.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 mb-12 md:grid-cols-2 lg:grid-cols-3">
              {supportedCampaigns.map((campaign, index) => (
                <ProjectCard key={campaign.campaign_id || index} project={campaign} index={index} />
              ))}
            </div>
          ) : (
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
          )} */}

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

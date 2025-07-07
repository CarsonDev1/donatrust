import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import EditText from '../../components/ui/EditText';
import userService from '../../services/userService';
import { useAuth } from '../../context/AuthContext';

const ProfileEdit = () => {
  const navigate = useNavigate();
  const { user: authUser, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    gender: '',
    date_of_birth: '',
    address: '',
    district: '',
    ward: '',
    bio: '',
    profile_image: '',
  });
  const [originalData, setOriginalData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserProfile();
    } else {
      navigate('/signin');
    }
  }, [isAuthenticated, navigate]);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await userService.getProfile();
      const userData = response.user || response;

      const profileData = {
        full_name: userData.full_name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        gender: userData.gender || '',
        date_of_birth: userData.date_of_birth || '',
        address: userData.address || '',
        district: userData.district || '',
        ward: userData.ward || '',
        bio: userData.bio || '',
        profile_image: userData.profile_image || '',
      };

      setFormData(profileData);
      setOriginalData(profileData);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError(error.message || 'Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear success message when user starts editing
    if (success) {
      setSuccess(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSaving(true);
      setError(null);

      // Only send changed fields
      const changedFields = {};
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== originalData[key] && key !== 'email') {
          // Don't allow email changes
          changedFields[key] = formData[key];
        }
      });

      if (Object.keys(changedFields).length === 0) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        return;
      }

      const response = await userService.updateProfile(changedFields);
      const updatedUser = response.user || response;

      // Update both form data and original data with the response
      const updatedData = {
        full_name: updatedUser.full_name || '',
        email: updatedUser.email || '',
        phone: updatedUser.phone || '',
        gender: updatedUser.gender || '',
        date_of_birth: updatedUser.date_of_birth || '',
        address: updatedUser.address || '',
        district: updatedUser.district || '',
        ward: updatedUser.ward || '',
        bio: updatedUser.bio || '',
        profile_image: updatedUser.profile_image || '',
      };

      setFormData(updatedData);
      setOriginalData(updatedData);
      setSuccess(true);

      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthenticated) {
    return null; // Will redirect to sign-in
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-global-3 shadow-2xl">
      {/* Add padding-top to push below fixed header */}
      <div className="relative pt-24">
        {/* Avatar and Label */}
        <div className="flex flex-col items-center">
          <img
            src={formData.profile_image || '/images/avt.jpg'}
            alt="Profile Picture"
            className="w-[120px] h-[120px] rounded-full border-4 border-global-3 bg-white object-cover"
          />
          <span className="mt-4 text-xl font-bold font-inter text-global-8">
            {formData.full_name || 'User'}
          </span>
        </div>

        {/* Edit Form Section */}
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
          <h1 className="text-2xl font-bold font-inter text-global-1 text-center mb-12">
            Edit personal information
          </h1>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <p className="text-red-600">{error}</p>
              <button
                onClick={fetchUserProfile}
                className="mt-2 text-red-600 underline hover:no-underline"
              >
                Try reloading profile data
              </button>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
              <p className="text-green-600">Profile updated successfully!</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <EditText
                  label="Full Name"
                  value={formData.full_name}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  required
                  className="h-[45px]"
                />

                <div>
                  <label className="block text-sm font-medium font-inter text-global-4 mb-1">
                    Sex
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full h-[45px] px-3 py-2 border border-global-8 rounded-lg bg-global-3 text-base font-inter text-global-9 outline-none"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium font-inter text-global-4 mb-1">
                    Date of birth
                  </label>
                  <input
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                    className="w-full h-[45px] px-3 py-2 border border-global-8 rounded-lg bg-global-3 text-base font-inter text-global-9 outline-none"
                    placeholder="dd/mm/yyyy"
                  />
                </div>

                <EditText
                  label="Phone number"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Phone number"
                  className="h-[45px]"
                />

                <div>
                  <label className="block text-sm font-medium font-inter text-global-4 mb-1">
                    Introduce yourself
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Maximum 255 characters"
                    maxLength={255}
                    rows={4}
                    className="w-full px-3 py-2 border border-global-8 rounded-lg bg-global-3 text-base font-inter text-global-9 outline-none resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.bio.length}/255 characters</p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium font-inter text-global-4 mb-1">
                    Email (Cannot be changed)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full h-[45px] px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-base font-inter text-gray-500 outline-none cursor-not-allowed"
                  />
                </div>

                <EditText
                  label="District"
                  value={formData.district}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                  placeholder="District"
                  className="h-[45px]"
                />

                <EditText
                  label="Ward"
                  value={formData.ward}
                  onChange={(e) => handleInputChange('ward', e.target.value)}
                  placeholder="Ward"
                  className="h-[45px]"
                />

                <EditText
                  label="Address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Address"
                  className="h-[45px]"
                />

                <EditText
                  label="Profile Image URL"
                  type="url"
                  value={formData.profile_image}
                  onChange={(e) => handleInputChange('profile_image', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="h-[45px]"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-8">
              <Button
                type="submit"
                variant="primary"
                disabled={isSaving}
                className="w-[200px] h-[40px] text-sm font-bold"
              >
                {isSaving ? 'Updating...' : 'Update Information'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;

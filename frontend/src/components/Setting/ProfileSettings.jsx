import { useState, useEffect } from 'react';
import userService from '../../services/userService';
import settingsService from '../../services/settingsService';
import { toast } from 'react-hot-toast';
import { Upload, Trash2 } from 'lucide-react';

const ProfileSettings = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    profilePicture: null
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const currentUser = userService.getCurrentUser();
        if (currentUser) {
          const userData = await userService.getUserById(currentUser.id);
          setFormData({
            name: userData.name || '',
            email: userData.email || '',
            phone: userData.phone || '',
            profilePicture: userData.profileImage || null
          });
          if (userData.profileImage) {
            setPreviewUrl(`http://localhost:8080/api/images/${userData.profileImage}`);
          }
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Failed to load profile data. Please try again.');
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File size should be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      setFormData(prev => ({ ...prev, profilePicture: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, profilePicture: null }));
    setPreviewUrl(null);
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    setError(null);
    try {
      const currentUser = userService.getCurrentUser();
      if (currentUser) {
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('phone', formData.phone);

        if (formData.profilePicture instanceof File) {
          formDataToSend.append('profileImage', formData.profilePicture);
        }

        const updatedUser = await settingsService.updateProfile(currentUser.id, formDataToSend);

        // Update preview URL with new image ID if available
        if (updatedUser.profileImage) {
          setPreviewUrl(`http://localhost:8080/api/images/${updatedUser.profileImage}`);
        }

        // Dispatch event to notify components about user data update
        window.dispatchEvent(new CustomEvent('userDataUpdated'));

        toast.success('Profile updated successfully');
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save profile changes. Please try again.');
      toast.error('Failed to save profile changes');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Profile Settings</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Profile Picture</label>
          <div className="mt-1 flex items-center space-x-6">
            <div className="flex-shrink-0">
              {previewUrl ? (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Profile preview"
                    className="h-24 w-24 rounded-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="h-24 w-24 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <Upload className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="profile-image"
                className="cursor-pointer bg-white dark:bg-gray-700 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
              >
                Change
                <input
                  id="profile-image"
                  name="profile-image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>
              <p className="mt-2 text-xs text-gray-500">
                PNG, JPG up to 5MB
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input
            type="email"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
          <input
            type="tel"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        <button
          type="button"
          onClick={handleSaveChanges}
          disabled={loading || saving}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 dark:ring-offset-gray-800"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>

        {error && (
          <div className="mt-2 text-sm text-red-600">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;
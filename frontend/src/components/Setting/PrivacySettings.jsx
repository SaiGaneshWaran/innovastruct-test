import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import userService from '../../services/userService';
import settingsService from '../../services/settingsService';
import { toast } from 'react-hot-toast';

const PrivacySettings = () => {
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showEmail: true,
    showPhone: false
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPrivacySettings = async () => {
      setLoading(true);
      setError(null);
      try {
        const currentUser = userService.getCurrentUser();
        if (currentUser) {
          try {
            const privacyData = await settingsService.getPrivacySettings(currentUser.id);
            setPrivacy(privacyData);
          } catch (err) {
            // If the endpoint doesn't exist yet, we'll use the default values
            console.log('Using default privacy settings');
          }
        }
      } catch (err) {
        console.error('Error loading privacy settings:', err);
        setError('Failed to load privacy settings. Please try again.');
        toast.error('Failed to load privacy settings');
      } finally {
        setLoading(false);
      }
    };

    loadPrivacySettings();
  }, []);

  const handleSaveSettings = async () => {
    setSaving(true);
    setError(null);
    try {
      const currentUser = userService.getCurrentUser();
      if (currentUser) {
        await settingsService.updatePrivacySettings(currentUser.id, privacy);
        toast.success('Privacy settings updated successfully');
      }
    } catch (err) {
      console.error('Error saving privacy settings:', err);
      setError('Failed to save privacy settings. Please try again.');
      toast.error('Failed to save privacy settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Privacy Settings</h2>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Profile Visibility</h3>
          <div className="flex space-x-4">
            <button
              className={`flex items-center px-4 py-2 rounded-md ${
                privacy.profileVisibility === 'public'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => setPrivacy({ ...privacy, profileVisibility: 'public' })}
            >
              <Eye className="w-5 h-5 mr-2" />
              Public
            </button>
            <button
              className={`flex items-center px-4 py-2 rounded-md ${
                privacy.profileVisibility === 'private'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => setPrivacy({ ...privacy, profileVisibility: 'private' })}
            >
              <EyeOff className="w-5 h-5 mr-2" />
              Private
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 ">Show Email</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Allow companies to see your email</p>
            </div>
            <button
              type="button"
              className={`${
                privacy.showEmail ? 'bg-yellow-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2`}
              onClick={() => setPrivacy({ ...privacy, showEmail: !privacy.showEmail })}
            >
              <span
                className={`${
                  privacy.showEmail ? 'translate-x-5' : 'translate-x-0'
                } inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 ">Show Phone Number</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Allow companies to see your phone number</p>
            </div>
            <button
              type="button"
              className={`${
                privacy.showPhone ? 'bg-yellow-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2`}
              onClick={() => setPrivacy({ ...privacy, showPhone: !privacy.showPhone })}
            >
              <span
                className={`${
                  privacy.showPhone ? 'translate-x-5' : 'translate-x-0'
                } inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out`}
              />
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSaveSettings}
        disabled={loading || saving}
        className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 dark:ring-offset-gray-800"
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>

      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
};

export default PrivacySettings;
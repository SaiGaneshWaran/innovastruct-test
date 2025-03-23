import { useState, useEffect } from 'react';
import userService from '../../services/userService';
import settingsService from '../../services/settingsService';
import { toast } from 'react-hot-toast';

const NotificationSettings = () => {
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    newBids: true,
    projectUpdates: true,
    marketing: false
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadNotificationSettings = async () => {
      setLoading(true);
      setError(null);
      try {
        const currentUser = userService.getCurrentUser();
        if (currentUser) {
          try {
            const notificationData = await settingsService.getNotificationSettings(currentUser.id);
            setNotifications(notificationData);
          } catch (err) {
            // If the endpoint doesn't exist yet, we'll use the default values
            console.log('Using default notification settings');
          }
        }
      } catch (err) {
        console.error('Error loading notification settings:', err);
        setError('Failed to load notification settings. Please try again.');
        toast.error('Failed to load notification settings');
      } finally {
        setLoading(false);
      }
    };

    loadNotificationSettings();
  }, []);

  const handleSaveSettings = async () => {
    setSaving(true);
    setError(null);
    try {
      const currentUser = userService.getCurrentUser();
      if (currentUser) {
        await settingsService.updateNotificationSettings(currentUser.id, notifications);
        toast.success('Notification settings updated successfully');
      }
    } catch (err) {
      console.error('Error saving notification settings:', err);
      setError('Failed to save notification settings. Please try again.');
      toast.error('Failed to save notification settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Notification Preferences</h2>

    <div className="space-y-4">
      {Object.entries(notifications).map(([key, value]) => (
        <div key={key} className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Receive notifications about {key.toLowerCase()}
            </p>
            </div>
            <button
              type="button"
              className={`${
                value ? 'bg-yellow-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2`}
              onClick={() => setNotifications({ ...notifications, [key]: !value })}
            >
              <span
                className={`${
                  value ? 'translate-x-5' : 'translate-x-0'
                } inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out`}
              />
            </button>
          </div>
        ))}
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

export default NotificationSettings;
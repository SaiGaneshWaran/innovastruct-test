import { useState, useEffect } from 'react';
import userService from '../../services/userService';
import settingsService from '../../services/settingsService';
import { toast } from 'react-hot-toast';

const RegionSettings = () => {
  const [region, setRegion] = useState({
    country: 'LK',
    timezone: 'Asia/Colombo',
    language: 'en'
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRegionSettings = async () => {
      setLoading(true);
      setError(null);
      try {
        const currentUser = userService.getCurrentUser();
        if (currentUser) {
          try {
            const regionData = await settingsService.getRegionSettings(currentUser.id);
            setRegion(regionData);
          } catch (err) {
            // If the endpoint doesn't exist yet, we'll use the default values
            console.log('Using default region settings');
          }
        }
      } catch (err) {
        console.error('Error loading region settings:', err);
        setError('Failed to load region settings. Please try again.');
        toast.error('Failed to load region settings');
      } finally {
        setLoading(false);
      }
    };

    loadRegionSettings();
  }, []);

  const handleSaveSettings = async () => {
    setSaving(true);
    setError(null);
    try {
      const currentUser = userService.getCurrentUser();
      if (currentUser) {
        await settingsService.updateRegionSettings(currentUser.id, region);
        toast.success('Region settings updated successfully');
      }
    } catch (err) {
      console.error('Error saving region settings:', err);
      setError('Failed to save region settings. Please try again.');
      toast.error('Failed to save region settings');
    } finally {
      setSaving(false);
    }
  };

  const countries = [
    { code: 'LK', name: 'Sri Lanka' },
    { code: 'IN', name: 'India' },
    { code: 'US', name: 'United States' }
  ];

  const timezones = [
    'Asia/Colombo',
    'Asia/Kolkata',
    'America/New_York'
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'si', name: 'Sinhala' },
    { code: 'ta', name: 'Tamil' }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Region Settings</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Country</label>
          <select
            value={region.country}
            onChange={(e) => setRegion({ ...region, country: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
          >
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Time Zone</label>
          <select
            value={region.timezone}
            onChange={(e) => setRegion({ ...region, timezone: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
          >
            {timezones.map((timezone) => (
              <option key={timezone} value={timezone} className="dark:bg-gray-700">
                {timezone}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Language</label>
          <select
            value={region.language}
            onChange={(e) => setRegion({ ...region, language: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
          >
            {languages.map((language) => (
              <option key={language.code} value={language.code} className="dark:bg-gray-700">
                {language.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={handleSaveSettings}
            disabled={loading || saving}
            className="inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 dark:ring-offset-gray-800"
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
    </div>
  );
};

export default RegionSettings;
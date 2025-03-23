import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import userService from '../../services/userService';
import settingsService from '../../services/settingsService';
import { toast } from 'react-hot-toast';

const ThemeSettings = () => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage and system preference on initial load
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
    return 'light';
  });
  const [fontSize, setFontSize] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Update the HTML class and localStorage when theme changes
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const loadThemeSettings = async () => {
      setLoading(true);
      setError(null);
      try {
        const currentUser = userService.getCurrentUser();
        if (currentUser) {
          try {
            const themeData = await settingsService.getThemeSettings(currentUser.id);
            setTheme(themeData.theme || theme);
            setFontSize(themeData.fontSize || fontSize);
          } catch (err) {
            // If the endpoint doesn't exist yet, we'll use the default values
            console.log('Using default theme settings');
          }
        }
      } catch (err) {
        console.error('Error loading theme settings:', err);
        setError('Failed to load theme settings. Please try again.');
        toast.error('Failed to load theme settings');
      } finally {
        setLoading(false);
      }
    };

    loadThemeSettings();
  }, []);

  const handleSaveSettings = async () => {
    setSaving(true);
    setError(null);
    try {
      const currentUser = userService.getCurrentUser();
      if (currentUser) {
        await settingsService.updateThemeSettings(currentUser.id, {
          theme,
          fontSize
        });
        toast.success('Theme settings updated successfully');
      }
    } catch (err) {
      console.error('Error saving theme settings:', err);
      setError('Failed to save theme settings. Please try again.');
      toast.error('Failed to save theme settings');
    } finally {
      setSaving(false);
    }
  };

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold dark:text-white">Theme Settings</h2>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme Mode</h3>
          <div className="flex space-x-4">
            <button
              className={`flex items-center px-4 py-2 rounded-md ${
                theme === 'light'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
              onClick={() => toggleTheme('light')}
            >
              <Sun className="w-5 h-5 mr-2" />
              Light
            </button>
            <button
              className={`flex items-center px-4 py-2 rounded-md ${
                theme === 'dark'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
              onClick={() => toggleTheme('dark')}
            >
              <Moon className="w-5 h-5 mr-2" />
              Dark
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Font Size</h3>
          <select
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
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

export default ThemeSettings;
package com.example.backend.service;

import com.example.backend.model.UserSettings;
import com.example.backend.repository.UserSettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class UserSettingsService {

    @Autowired
    private UserSettingsRepository userSettingsRepository;

    public Optional<UserSettings> getUserSettingsByUserId(String userId) {
        return userSettingsRepository.findByUserId(userId);
    }

    public UserSettings createUserSettings(String userId) {
        UserSettings userSettings = new UserSettings(userId);

        // Set default notification settings
        Map<String, Boolean> defaultNotificationSettings = new HashMap<>();
        defaultNotificationSettings.put("emailUpdates", true);
        defaultNotificationSettings.put("newBids", true);
        defaultNotificationSettings.put("projectUpdates", true);
        defaultNotificationSettings.put("marketing", false);
        userSettings.setNotificationSettings(defaultNotificationSettings);

        // Set default privacy settings
        Map<String, Object> defaultPrivacySettings = new HashMap<>();
        defaultPrivacySettings.put("profileVisibility", "public");
        defaultPrivacySettings.put("showEmail", true);
        defaultPrivacySettings.put("showPhone", false);
        userSettings.setPrivacySettings(defaultPrivacySettings);

        // Set default region settings
        Map<String, String> defaultRegionSettings = new HashMap<>();
        defaultRegionSettings.put("country", "LK");
        defaultRegionSettings.put("timezone", "Asia/Colombo");
        defaultRegionSettings.put("language", "en");
        userSettings.setRegionSettings(defaultRegionSettings);

        // Set default theme settings
        Map<String, String> defaultThemeSettings = new HashMap<>();
        defaultThemeSettings.put("theme", "light");
        defaultThemeSettings.put("fontSize", "medium");
        userSettings.setThemeSettings(defaultThemeSettings);

        // Set timestamps
        String now = LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME);
        userSettings.setCreatedAt(now);
        userSettings.setUpdatedAt(now);

        return userSettingsRepository.save(userSettings);
    }

    public UserSettings getOrCreateUserSettings(String userId) {
        return getUserSettingsByUserId(userId)
                .orElseGet(() -> createUserSettings(userId));
    }

    public UserSettings updateNotificationSettings(String userId, Map<String, Boolean> notificationSettings) {
        UserSettings userSettings = getOrCreateUserSettings(userId);
        userSettings.setNotificationSettings(notificationSettings);
        userSettings.setUpdatedAt(LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        return userSettingsRepository.save(userSettings);
    }

    public UserSettings updatePrivacySettings(String userId, Map<String, Object> privacySettings) {
        UserSettings userSettings = getOrCreateUserSettings(userId);
        userSettings.setPrivacySettings(privacySettings);
        userSettings.setUpdatedAt(LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        return userSettingsRepository.save(userSettings);
    }

    public UserSettings updateRegionSettings(String userId, Map<String, String> regionSettings) {
        UserSettings userSettings = getOrCreateUserSettings(userId);
        userSettings.setRegionSettings(regionSettings);
        userSettings.setUpdatedAt(LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        return userSettingsRepository.save(userSettings);
    }

    public UserSettings updateThemeSettings(String userId, Map<String, String> themeSettings) {
        UserSettings userSettings = getOrCreateUserSettings(userId);
        userSettings.setThemeSettings(themeSettings);
        userSettings.setUpdatedAt(LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        return userSettingsRepository.save(userSettings);
    }
}
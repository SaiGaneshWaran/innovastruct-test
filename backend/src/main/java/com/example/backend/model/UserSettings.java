package com.example.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashMap;
import java.util.Map;

@Document(collection = "user_settings")
public class UserSettings {
    @Id
    private String id;
    private String userId;
    private Map<String, Boolean> notificationSettings;
    private Map<String, Object> privacySettings;
    private Map<String, String> regionSettings;
    private Map<String, String> themeSettings;
    private String createdAt;
    private String updatedAt;

    public UserSettings() {
        this.notificationSettings = new HashMap<>();
        this.privacySettings = new HashMap<>();
        this.regionSettings = new HashMap<>();
        this.themeSettings = new HashMap<>();
    }

    public UserSettings(String userId) {
        this.userId = userId;
        this.notificationSettings = new HashMap<>();
        this.privacySettings = new HashMap<>();
        this.regionSettings = new HashMap<>();
        this.themeSettings = new HashMap<>();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Map<String, Boolean> getNotificationSettings() {
        return notificationSettings;
    }

    public void setNotificationSettings(Map<String, Boolean> notificationSettings) {
        this.notificationSettings = notificationSettings;
    }

    public Map<String, Object> getPrivacySettings() {
        return privacySettings;
    }

    public void setPrivacySettings(Map<String, Object> privacySettings) {
        this.privacySettings = privacySettings;
    }

    public Map<String, String> getRegionSettings() {
        return regionSettings;
    }

    public void setRegionSettings(Map<String, String> regionSettings) {
        this.regionSettings = regionSettings;
    }

    public Map<String, String> getThemeSettings() {
        return themeSettings;
    }

    public void setThemeSettings(Map<String, String> themeSettings) {
        this.themeSettings = themeSettings;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }
}
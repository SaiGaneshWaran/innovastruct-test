package com.example.backend.controller;

import com.example.backend.model.User;
import com.example.backend.model.UserSettings;
import com.example.backend.service.UserService;
import com.example.backend.service.UserSettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(maxAge = 3600)
@RestController
@RequestMapping("/api/settings")
public class SettingsController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserSettingsService userSettingsService;

    // Notification settings
    @GetMapping("/notifications/{userId}")
    public ResponseEntity<Map<String, Boolean>> getNotificationSettings(@PathVariable String userId) {
        return userService.getUserById(userId)
                .map(user -> {
                    UserSettings userSettings = userSettingsService.getOrCreateUserSettings(userId);
                    return ResponseEntity.ok(userSettings.getNotificationSettings());
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/notifications/{userId}")
    public ResponseEntity<Map<String, Boolean>> updateNotificationSettings(
            @PathVariable String userId,
            @RequestBody Map<String, Boolean> notificationSettings) {
        return userService.getUserById(userId)
                .map(user -> {
                    UserSettings updatedSettings = userSettingsService.updateNotificationSettings(userId, notificationSettings);
                    return ResponseEntity.ok(updatedSettings.getNotificationSettings());
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Privacy settings
    @GetMapping("/privacy/{userId}")
    public ResponseEntity<Map<String, Object>> getPrivacySettings(@PathVariable String userId) {
        return userService.getUserById(userId)
                .map(user -> {
                    UserSettings userSettings = userSettingsService.getOrCreateUserSettings(userId);
                    return ResponseEntity.ok(userSettings.getPrivacySettings());
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/privacy/{userId}")
    public ResponseEntity<Map<String, Object>> updatePrivacySettings(
            @PathVariable String userId,
            @RequestBody Map<String, Object> privacySettings) {
        return userService.getUserById(userId)
                .map(user -> {
                    UserSettings updatedSettings = userSettingsService.updatePrivacySettings(userId, privacySettings);
                    return ResponseEntity.ok(updatedSettings.getPrivacySettings());
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Region settings
    @GetMapping("/region/{userId}")
    public ResponseEntity<Map<String, String>> getRegionSettings(@PathVariable String userId) {
        return userService.getUserById(userId)
                .map(user -> {
                    UserSettings userSettings = userSettingsService.getOrCreateUserSettings(userId);
                    return ResponseEntity.ok(userSettings.getRegionSettings());
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/region/{userId}")
    public ResponseEntity<Map<String, String>> updateRegionSettings(
            @PathVariable String userId,
            @RequestBody Map<String, String> regionSettings) {
        return userService.getUserById(userId)
                .map(user -> {
                    UserSettings updatedSettings = userSettingsService.updateRegionSettings(userId, regionSettings);
                    return ResponseEntity.ok(updatedSettings.getRegionSettings());
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Theme settings
    @GetMapping("/theme/{userId}")
    public ResponseEntity<Map<String, String>> getThemeSettings(@PathVariable String userId) {
        return userService.getUserById(userId)
                .map(user -> {
                    UserSettings userSettings = userSettingsService.getOrCreateUserSettings(userId);
                    return ResponseEntity.ok(userSettings.getThemeSettings());
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/theme/{userId}")
    public ResponseEntity<Map<String, String>> updateThemeSettings(
            @PathVariable String userId,
            @RequestBody Map<String, String> themeSettings) {
        return userService.getUserById(userId)
                .map(user -> {
                    UserSettings updatedSettings = userSettingsService.updateThemeSettings(userId, themeSettings);
                    return ResponseEntity.ok(updatedSettings.getThemeSettings());
                })
                .orElse(ResponseEntity.notFound().build());
    }
    }
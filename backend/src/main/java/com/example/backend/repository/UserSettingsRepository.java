package com.example.backend.repository;

import com.example.backend.model.UserSettings;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserSettingsRepository extends MongoRepository<UserSettings, String> {
    Optional<UserSettings> findByUserId(String userId);
    boolean existsByUserId(String userId);
}
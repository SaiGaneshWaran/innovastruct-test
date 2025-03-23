package com.example.backend.repository;

import com.example.backend.model.Image;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ImageRepository extends MongoRepository<Image, String> {
    List<Image> findByEntityTypeAndEntityId(String entityType, String entityId);
    void deleteByEntityTypeAndEntityId(String entityType, String entityId);
}
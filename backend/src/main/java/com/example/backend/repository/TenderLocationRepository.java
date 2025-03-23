package com.example.backend.repository;

import com.example.backend.model.TenderLocation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TenderLocationRepository extends MongoRepository<TenderLocation, String> {
    // Add custom query methods if needed
}
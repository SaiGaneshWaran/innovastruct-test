package com.example.backend.repository;

import com.example.backend.model.Company;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompanyRepository extends MongoRepository<Company, String> {
    List<Company> findByType(String type);
    List<Company> findByNameContainingIgnoreCase(String name);
    List<Company> findByRatingGreaterThanEqual(double rating);
    List<Company> findByServicesContaining(String service);
}
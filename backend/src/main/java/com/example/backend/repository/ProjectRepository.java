package com.example.backend.repository;

import com.example.backend.model.Project;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProjectRepository extends MongoRepository<Project, String> {
    void deleteByCompanyId(String companyId);
}
package com.example.backend.repository;

import com.example.backend.model.Certification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CertificationRepository extends MongoRepository<Certification, String> {
    void deleteByCompanyId(String companyId);
}
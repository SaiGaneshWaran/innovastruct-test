package com.example.backend.repository;

import com.example.backend.model.Tender;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TenderRepository extends MongoRepository<Tender, String> {
    List<Tender> findByClientId(String clientId);
    List<Tender> findByStatus(String status);
    List<Tender> findByBidIdsIn(List<String> bidIds);
}
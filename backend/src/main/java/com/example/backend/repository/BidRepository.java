package com.example.backend.repository;

import com.example.backend.model.Bid;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BidRepository extends MongoRepository<Bid, String> {
    List<Bid> findByCompanyId(String companyId);
    List<Bid> findByStatus(String status);
}
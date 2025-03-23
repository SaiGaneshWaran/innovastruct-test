package com.example.backend.service;

import com.example.backend.model.Bid;
import com.example.backend.model.Tender;
import com.example.backend.repository.BidRepository;
import com.example.backend.repository.TenderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BidService {

    @Autowired
    private BidRepository bidRepository;

    @Autowired
    private TenderRepository tenderRepository;

    public List<Map<String, Object>> getBidsByCompanyId(String companyId) {
        List<Bid> bids = bidRepository.findByCompanyId(companyId);
        return bids.stream().map(bid -> {
            Map<String, Object> bidData = new HashMap<>();
            bidData.put("id", bid.getId());
            bidData.put("companyId", bid.getCompanyId());
            bidData.put("companyName", bid.getCompanyName());
            bidData.put("amount", bid.getAmount());
            bidData.put("proposedDeadline", bid.getProposedDeadline());
            bidData.put("message", bid.getMessage());
            bidData.put("status", bid.getStatus());
            bidData.put("createdAt", bid.getCreatedAt());

            // Get tender details
            Optional<Tender> tender = tenderRepository.findById(bid.getTenderId());
            if (tender.isPresent()) {
                bidData.put("tenderTitle", tender.get().getTitle());
                bidData.put("originalBudget", tender.get().getBudget());
                bidData.put("clientId", tender.get().getClientId());
                bidData.put("deadline", tender.get().getDeadline());
            }

            return bidData;
        }).collect(Collectors.toList());
    }

    public List<Bid> getAllBids() {
        return bidRepository.findAll();
    }

    public Optional<Bid> getBidById(String id) {
        return bidRepository.findById(id);
    }

    public List<Bid> getBidsByStatus(String status) {
        return bidRepository.findByStatus(status);
    }

    public Bid createBid(Bid bid) {
        bid.setCreatedAt(LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        bid.setStatus("pending");
        return bidRepository.save(bid);
    }

    public Bid updateBidStatus(String id, String status) {
        return bidRepository.findById(id)
                .map(bid -> {
                    bid.setStatus(status);
                    return bidRepository.save(bid);
                })
                .orElseThrow(() -> new RuntimeException("Bid not found with id " + id));
    }

    public void deleteBid(String id) {
        bidRepository.deleteById(id);
    }
}
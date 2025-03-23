package com.example.backend.service;

import com.example.backend.model.Bid;
import com.example.backend.model.Tender;
import com.example.backend.repository.BidRepository;
import com.example.backend.repository.TenderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TenderService {

    @Autowired
    private TenderRepository tenderRepository;

    @Autowired
    private BidRepository bidRepository;

    public List<Tender> getAllTenders() {
        return tenderRepository.findAll();
    }

    public Optional<Tender> getTenderById(String id) {
        return tenderRepository.findById(id);
    }

    public List<Tender> getTendersByClientId(String clientId) {
        return tenderRepository.findByClientId(clientId);
    }

    public List<Tender> getTendersByStatus(String status) {
        return tenderRepository.findByStatus(status);
    }

    public List<Tender> getTendersByCompanyBids(String companyId) {
        // First, find all bids by the company
        List<Bid> companyBids = bidRepository.findByCompanyId(companyId);

        // Extract bid IDs
        List<String> bidIds = companyBids.stream()
                .map(Bid::getId)
                .collect(Collectors.toList());

        // If no bids found, return empty list
        if (bidIds.isEmpty()) {
            return new ArrayList<>();
        }

        // Find tenders containing any of these bid IDs
        return tenderRepository.findByBidIdsIn(bidIds);
    }

    public Tender createTender(Tender tender) {
        tender.setCreatedAt(LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        tender.setStatus("new");
        tender.setBidsCount(0);
        return tenderRepository.save(tender);
    }

    public Tender updateTender(String id, Tender tenderDetails) {
        return tenderRepository.findById(id)
                .map(tender -> {
                    // Only update fields that are provided in tenderDetails
                    if (tenderDetails.getTitle() != null) {
                        tender.setTitle(tenderDetails.getTitle());
                    }
                    if (tenderDetails.getDescription() != null) {
                        tender.setDescription(tenderDetails.getDescription());
                    }
                    if (tenderDetails.getBudget() > 0) {
                        tender.setBudget(tenderDetails.getBudget());
                    }
                    if (tenderDetails.getDeadline() != null) {
                        tender.setDeadline(tenderDetails.getDeadline());
                    }
                    if (tenderDetails.getStatus() != null) {
                        tender.setStatus(tenderDetails.getStatus());

                        // If tender is being closed (status changed to 'ended')
                        if ("ended".equals(tenderDetails.getStatus())) {
                            // Get all bids for this tender
                            List<String> bidIds = tender.getBidIds();
                            if (bidIds != null && !bidIds.isEmpty()) {
                                List<Bid> bids = bidRepository.findAllById(bidIds);

                                // Find the lowest bid
                                Bid lowestBid = null;
                                double lowestAmount = Double.MAX_VALUE;

                                for (Bid bid : bids) {
                                    if (bid.getAmount() < lowestAmount) {
                                        lowestAmount = bid.getAmount();
                                        lowestBid = bid;
                                    }
                                }

                                // Accept the lowest bid and reject others
                                for (Bid bid : bids) {
                                    if (bid == lowestBid) {
                                        bid.setStatus("accepted");
                                    } else {
                                        bid.setStatus("rejected");
                                    }
                                    bidRepository.save(bid);
                                }
                            }
                        }
                    }
                    return tenderRepository.save(tender);
                })
                .orElseThrow(() -> new RuntimeException("Tender not found with id " + id));
    }

    public Tender addBidToTender(String tenderId, Bid bid) {
        return tenderRepository.findById(tenderId)
                .map(tender -> {
                    // Create and save the bid first
                    bid.setCreatedAt(LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
                    bid.setStatus("pending");
                    bid.setTenderId(tenderId);
                    Bid savedBid = bidRepository.save(bid);

                    // Add the bid ID to the tender
                    List<String> bidIds = tender.getBidIds();
                    bidIds.add(savedBid.getId());
                    tender.setBidIds(bidIds);
                    tender.setBidsCount(bidIds.size());

                    // Update lowest bid if applicable
                    if (tender.getLowestBid() == null || bid.getAmount() < tender.getLowestBid()) {
                        tender.setLowestBid(bid.getAmount());
                    }

                    return tenderRepository.save(tender);
                })
                .orElseThrow(() -> new RuntimeException("Tender not found with id " + tenderId));
    }

    public void deleteTender(String id) {
        tenderRepository.deleteById(id);
    }
}
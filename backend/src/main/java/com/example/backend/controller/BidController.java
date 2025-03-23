package com.example.backend.controller;

import com.example.backend.model.Bid;
import com.example.backend.service.BidService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(maxAge = 3600)
@RestController
@RequestMapping("/api/bids")
public class BidController {

    @Autowired
    private BidService bidService;

    @GetMapping
    public ResponseEntity<List<Bid>> getAllBids() {
        return ResponseEntity.ok(bidService.getAllBids());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bid> getBidById(@PathVariable String id) {
        return bidService.getBidById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<Map<String, Object>>> getBidsByCompanyId(@PathVariable String companyId) {
        return ResponseEntity.ok(bidService.getBidsByCompanyId(companyId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Bid>> getBidsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(bidService.getBidsByStatus(status));
    }

    @PostMapping
    public ResponseEntity<Bid> createBid(@RequestBody Bid bid) {
        return new ResponseEntity<>(bidService.createBid(bid), HttpStatus.CREATED);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Bid> updateBidStatus(@PathVariable String id, @RequestBody String status) {
        return ResponseEntity.ok(bidService.updateBidStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBid(@PathVariable String id) {
        bidService.deleteBid(id);
        return ResponseEntity.noContent().build();
    }
}
package com.example.backend.controller;

import com.example.backend.model.Bid;
import com.example.backend.model.Tender;
import com.example.backend.service.TenderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(maxAge = 3600)
@RestController
@RequestMapping("/api/tenders")
public class TenderController {

    @Autowired
    private TenderService tenderService;

    @GetMapping
    public ResponseEntity<List<Tender>> getAllTenders() {
        return ResponseEntity.ok(tenderService.getAllTenders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tender> getTenderById(@PathVariable String id) {
        return tenderService.getTenderById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<Tender>> getTendersByClientId(@PathVariable String clientId) {
        return ResponseEntity.ok(tenderService.getTendersByClientId(clientId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Tender>> getTendersByStatus(@PathVariable String status) {
        return ResponseEntity.ok(tenderService.getTendersByStatus(status));
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<Tender>> getTendersByCompanyBids(@PathVariable String companyId) {
        return ResponseEntity.ok(tenderService.getTendersByCompanyBids(companyId));
    }

    @PostMapping
    public ResponseEntity<Tender> createTender(@RequestBody Tender tender) {
        return new ResponseEntity<>(tenderService.createTender(tender), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tender> updateTender(@PathVariable String id, @RequestBody Tender tenderDetails) {
        return ResponseEntity.ok(tenderService.updateTender(id, tenderDetails));
    }

    @PostMapping("/{id}/bids")
    public ResponseEntity<Tender> addBidToTender(@PathVariable String id, @RequestBody Bid bid) {
        return ResponseEntity.ok(tenderService.addBidToTender(id, bid));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTender(@PathVariable String id) {
        tenderService.deleteTender(id);
        return ResponseEntity.noContent().build();
    }
}
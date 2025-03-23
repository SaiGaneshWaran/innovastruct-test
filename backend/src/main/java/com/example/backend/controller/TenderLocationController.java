package com.example.backend.controller;

import com.example.backend.model.TenderLocation;
import com.example.backend.service.TenderLocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(maxAge = 3600)
@RestController
@RequestMapping("/api/tenders/locations")
public class TenderLocationController {

    @Autowired
    private TenderLocationService tenderLocationService;

    @GetMapping
    public ResponseEntity<List<TenderLocation>> getAllTenderLocations() {
        return ResponseEntity.ok(tenderLocationService.getAllTenderLocations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TenderLocation> getTenderLocationById(@PathVariable String id) {
        return tenderLocationService.getTenderLocationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<TenderLocation> createTenderLocation(@RequestBody TenderLocation tenderLocation) {
        return ResponseEntity.ok(tenderLocationService.createTenderLocation(tenderLocation));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TenderLocation> updateTenderLocation(
            @PathVariable String id,
            @RequestBody TenderLocation tenderLocationDetails) {
        return ResponseEntity.ok(tenderLocationService.updateTenderLocation(id, tenderLocationDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTenderLocation(@PathVariable String id) {
        tenderLocationService.deleteTenderLocation(id);
        return ResponseEntity.noContent().build();
    }
}
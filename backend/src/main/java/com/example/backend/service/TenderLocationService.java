package com.example.backend.service;

import com.example.backend.model.TenderLocation;

import java.util.List;
import java.util.Optional;

public interface TenderLocationService {
    List<TenderLocation> getAllTenderLocations();
    Optional<TenderLocation> getTenderLocationById(String id);
    TenderLocation createTenderLocation(TenderLocation tenderLocation);
    TenderLocation updateTenderLocation(String id, TenderLocation tenderLocationDetails);
    void deleteTenderLocation(String id);
}
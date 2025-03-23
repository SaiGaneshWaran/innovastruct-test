package com.example.backend.service;

import com.example.backend.model.TenderLocation;
import com.example.backend.repository.TenderLocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TenderLocationServiceImpl implements TenderLocationService {

    @Autowired
    private TenderLocationRepository tenderLocationRepository;

    @Override
    public List<TenderLocation> getAllTenderLocations() {
        return tenderLocationRepository.findAll();
    }

    @Override
    public Optional<TenderLocation> getTenderLocationById(String id) {
        return tenderLocationRepository.findById(id);
    }

    @Override
    public TenderLocation createTenderLocation(TenderLocation tenderLocation) {
        return tenderLocationRepository.save(tenderLocation);
    }

    @Override
    public TenderLocation updateTenderLocation(String id, TenderLocation tenderLocationDetails) {
        Optional<TenderLocation> tenderLocationOpt = tenderLocationRepository.findById(id);
        if (tenderLocationOpt.isPresent()) {
            TenderLocation existingLocation = tenderLocationOpt.get();
            existingLocation.setDistrict(tenderLocationDetails.getDistrict());
            existingLocation.setCoordinates(tenderLocationDetails.getCoordinates());
            existingLocation.setTenderCount(tenderLocationDetails.getTenderCount());
            existingLocation.setActiveTenders(tenderLocationDetails.getActiveTenders());
            existingLocation.setTotalValue(tenderLocationDetails.getTotalValue());
            return tenderLocationRepository.save(existingLocation);
        }
        return null;
    }

    @Override
    public void deleteTenderLocation(String id) {
        tenderLocationRepository.deleteById(id);
    }
}
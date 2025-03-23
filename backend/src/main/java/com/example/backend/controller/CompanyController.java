package com.example.backend.controller;

import com.example.backend.model.Company;
import com.example.backend.model.Review;
import com.example.backend.service.CompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(maxAge = 3600)
@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    @Autowired
    private CompanyService companyService;

    @GetMapping
    public ResponseEntity<List<Company>> getAllCompanies() {
        return ResponseEntity.ok(companyService.getAllCompanies());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Company> getCompanyById(@PathVariable String id) {
        return companyService.getCompanyById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/has-portfolio")
    public ResponseEntity<Boolean> hasPortfolio(@PathVariable String id) {
        return companyService.getCompanyById(id)
                .map(company -> ResponseEntity.ok(
                    company.getShortDescription() != null &&
                    company.getServices() != null &&
                    !company.getServices().isEmpty()
                ))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Company>> getCompaniesByType(@PathVariable String type) {
        return ResponseEntity.ok(companyService.getCompaniesByType(type));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Company>> searchCompaniesByName(@RequestParam String name) {
        return ResponseEntity.ok(companyService.searchCompaniesByName(name));
    }

    @GetMapping("/rating/{minRating}")
    public ResponseEntity<List<Company>> getCompaniesByRating(@PathVariable double minRating) {
        return ResponseEntity.ok(companyService.getCompaniesByRating(minRating));
    }

    @GetMapping("/service/{service}")
    public ResponseEntity<List<Company>> getCompaniesByService(@PathVariable String service) {
        return ResponseEntity.ok(companyService.getCompaniesByService(service));
    }

    @PostMapping
    public ResponseEntity<Company> createCompany(@RequestBody Company company) {
        return new ResponseEntity<>(companyService.createCompany(company), HttpStatus.CREATED);
    }

    @PostMapping("/register")
    public ResponseEntity<Company> createCompanyWithUser(@RequestBody Company company) {
        return new ResponseEntity<>(companyService.createCompany(company), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Company> updateCompany(@PathVariable String id, @RequestBody Company companyDetails) {
        return ResponseEntity.ok(companyService.updateCompany(id, companyDetails));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCompany(@PathVariable String id) {
        companyService.deleteCompany(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/reviews")
    public ResponseEntity<Company> addReview(@PathVariable String id, @RequestBody Review review) {
        return ResponseEntity.ok(companyService.addReview(id, review));
    }
}
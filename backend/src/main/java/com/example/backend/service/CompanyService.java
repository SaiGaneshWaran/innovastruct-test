package com.example.backend.service;

import com.example.backend.model.Company;
import com.example.backend.model.Review;
import com.example.backend.repository.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CompanyService {

    @Autowired
    private CompanyRepository companyRepository;

    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    public Optional<Company> getCompanyById(String id) {
        return companyRepository.findById(id);
    }

    public List<Company> getCompaniesByType(String type) {
        return companyRepository.findByType(type);
    }

    public List<Company> searchCompaniesByName(String name) {
        return companyRepository.findByNameContainingIgnoreCase(name);
    }

    public List<Company> getCompaniesByRating(double minRating) {
        return companyRepository.findByRatingGreaterThanEqual(minRating);
    }

    public List<Company> getCompaniesByService(String service) {
        return companyRepository.findByServicesContaining(service);
    }

    public Company createCompany(Company company) {
        String now = LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME);
        company.setCreatedAt(now);
        company.setUpdatedAt(now);
        company.setRating(0.0); // Default rating for new companies
        return companyRepository.save(company);
    }

    public Company updateCompany(String id, Company companyDetails) {
        return companyRepository.findById(id)
                .map(company -> {
                    company.setName(companyDetails.getName());
                    company.setLicense(companyDetails.getLicense());
                    company.setType(companyDetails.getType());
                    company.setShortDescription(companyDetails.getShortDescription());
                    company.setDescription(companyDetails.getDescription());
                    company.setEstablished(companyDetails.getEstablished());
                    company.setLocation(companyDetails.getLocation());
                    company.setEmployees(companyDetails.getEmployees());
                    company.setServices(companyDetails.getServices());
                    company.setCoverImage(companyDetails.getCoverImage());
                    company.setProfileIcon(companyDetails.getProfileIcon());
                    company.setUpdatedAt(LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
                    return companyRepository.save(company);
                })
                .orElseThrow(() -> new RuntimeException("Company not found with id " + id));
    }

    public void deleteCompany(String id) {
        companyRepository.deleteById(id);
    }

    public Company addReview(String companyId, Review review) {
        Optional<Company> companyOpt = companyRepository.findById(companyId);
        if (companyOpt.isPresent()) {
            Company company = companyOpt.get();

            // Set the review date
            review.setDate(LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));

            // Ensure review has an ID
            if (review.getId() == null) {
                review.setId(UUID.randomUUID().toString());
            }

            // Initialize reviews list if null
            if (company.getReviews() == null) {
                company.setReviews(new ArrayList<>());
            }

            // Add the review
            company.getReviews().add(review);

            // Update company rating
            double totalRating = company.getReviews().stream()
                    .mapToDouble(Review::getRating)
                    .sum();
            company.setRating(totalRating / company.getReviews().size());

            return companyRepository.save(company);
        }
        throw new RuntimeException("Company not found with id: " + companyId);
    }
}
package com.example.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.util.List;

@Document(collection = "companies")
public class Company {
    @Id
    private String id;
    private String name;
    private String license;
    private String type;
    private String shortDescription;
    private String description;
    private String established;
    private String location;
    private String employees;
    private List<String> services;
    private String coverImage;
    private String profileIcon;
    private double rating;
    @DBRef
    @JsonManagedReference
    private List<Project> projects;
    private List<Review> reviews;
    private TrackRecord trackRecord;
    private FinancialStability financialStability;
    private ServicesOffered servicesOffered;

    // New fields for portfolio
    @DBRef
    @JsonManagedReference
    private List<Certification> certifications;
    private String email;
    private String phoneNumber;
    private String website;
    private String annualRevenue;
    private String fundingSources;
    private String cidaGrading;
    private Integer engineerCapacity;

    private String createdAt;
    private String updatedAt;

    public Company() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLicense() {
        return license;
    }

    public void setLicense(String license) {
        this.license = license;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getShortDescription() {
        return shortDescription;
    }

    public void setShortDescription(String shortDescription) {
        this.shortDescription = shortDescription;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getEstablished() {
        return established;
    }

    public void setEstablished(String established) {
        this.established = established;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getEmployees() {
        return employees;
    }

    public void setEmployees(String employees) {
        this.employees = employees;
    }

    public List<String> getServices() {
        return services;
    }

    public void setServices(List<String> services) {
        this.services = services;
    }

    public String getCoverImage() {
        return coverImage;
    }

    public void setCoverImage(String coverImage) {
        this.coverImage = coverImage;
    }

    public String getProfileIcon() {
        return profileIcon;
    }

    public void setProfileIcon(String profileIcon) {
        this.profileIcon = profileIcon;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public List<Project> getProjects() {
        return projects;
    }

    public void setProjects(List<Project> projects) {
        this.projects = projects;
    }

    public List<Review> getReviews() {
        return reviews;
    }

    public void setReviews(List<Review> reviews) {
        this.reviews = reviews;
    }

    public TrackRecord getTrackRecord() {
        return trackRecord;
    }

    public void setTrackRecord(TrackRecord trackRecord) {
        this.trackRecord = trackRecord;
    }

    public FinancialStability getFinancialStability() {
        return financialStability;
    }

    public void setFinancialStability(FinancialStability financialStability) {
        this.financialStability = financialStability;
    }

    public ServicesOffered getServicesOffered() {
        return servicesOffered;
    }

    public void setServicesOffered(ServicesOffered servicesOffered) {
        this.servicesOffered = servicesOffered;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<Certification> getCertifications() {
        return certifications;
    }

    public void setCertifications(List<Certification> certifications) {
        this.certifications = certifications;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public String getAnnualRevenue() {
        return annualRevenue;
    }

    public void setAnnualRevenue(String annualRevenue) {
        this.annualRevenue = annualRevenue;
    }

    public String getFundingSources() {
        return fundingSources;
    }

    public void setFundingSources(String fundingSources) {
        this.fundingSources = fundingSources;
    }

    public String getCidaGrading() {
        return cidaGrading;
    }

    public void setCidaGrading(String cidaGrading) {
        this.cidaGrading = cidaGrading;
    }

    public Integer getEngineerCapacity() {
        return engineerCapacity;
    }

    public void setEngineerCapacity(Integer engineerCapacity) {
        this.engineerCapacity = engineerCapacity;
    }
}
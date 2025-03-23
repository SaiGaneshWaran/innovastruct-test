package com.example.backend.dto;

import java.util.List;
import java.util.Map;

public class PortfolioDTO {
    private String companyId;
    private String companyName;
    private String licenseNumber;
    private String shortDescription;
    private String establishedYear;
    private String location;
    private String employeeCount;
    private List<String> services;
    private List<ProjectDTO> projects;
    private String annualRevenue;
    private String fundingSources;
    private List<CertificationDTO> certifications;
    private Map<String, String> contactInformation;
    private String cidaGrading;
    private Integer engineerCapacity;

    // Getters and Setters
    public String getCompanyId() {
        return companyId;
    }

    public void setCompanyId(String companyId) {
        this.companyId = companyId;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getLicenseNumber() {
        return licenseNumber;
    }

    public void setLicenseNumber(String licenseNumber) {
        this.licenseNumber = licenseNumber;
    }

    public String getShortDescription() {
        return shortDescription;
    }

    public void setShortDescription(String shortDescription) {
        this.shortDescription = shortDescription;
    }

    public String getEstablishedYear() {
        return establishedYear;
    }

    public void setEstablishedYear(String establishedYear) {
        this.establishedYear = establishedYear;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getEmployeeCount() {
        return employeeCount;
    }

    public void setEmployeeCount(String employeeCount) {
        this.employeeCount = employeeCount;
    }

    public List<String> getServices() {
        return services;
    }

    public void setServices(List<String> services) {
        this.services = services;
    }

    public List<ProjectDTO> getProjects() {
        return projects;
    }

    public void setProjects(List<ProjectDTO> projects) {
        this.projects = projects;
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

    public List<CertificationDTO> getCertifications() {
        return certifications;
    }

    public void setCertifications(List<CertificationDTO> certifications) {
        this.certifications = certifications;
    }

    public Map<String, String> getContactInformation() {
        return contactInformation;
    }

    public void setContactInformation(Map<String, String> contactInformation) {
        this.contactInformation = contactInformation;
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

    public static class ProjectDTO {
        private String name;
        private String description;
        private String completionYear;
        private List<String> images;

        // Getters and Setters
        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getCompletionYear() {
            return completionYear;
        }

        public void setCompletionYear(String completionYear) {
            this.completionYear = completionYear;
        }

        public List<String> getImages() {
            return images;
        }

        public void setImages(List<String> images) {
            this.images = images;
        }
    }

    public static class CertificationDTO {
        private String name;
        private String organization;
        private String issueDate;
        private String expiryDate;
        private String image;

        // Getters and Setters
        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getOrganization() {
            return organization;
        }

        public void setOrganization(String organization) {
            this.organization = organization;
        }

        public String getIssueDate() {
            return issueDate;
        }

        public void setIssueDate(String issueDate) {
            this.issueDate = issueDate;
        }

        public String getExpiryDate() {
            return expiryDate;
        }

        public void setExpiryDate(String expiryDate) {
            this.expiryDate = expiryDate;
        }

        public String getImage() {
            return image;
        }

        public void setImage(String image) {
            this.image = image;
        }
    }
}
package com.example.backend.model;

import java.util.List;

public class ServicesOffered {
    private List<String> primaryServices;
    private List<String> specializations;
    private List<String> certifications;
    private ServiceCapabilities serviceCapabilities;

    public ServicesOffered() {
    }

    public List<String> getPrimaryServices() {
        return primaryServices;
    }

    public void setPrimaryServices(List<String> primaryServices) {
        this.primaryServices = primaryServices;
    }

    public List<String> getSpecializations() {
        return specializations;
    }

    public void setSpecializations(List<String> specializations) {
        this.specializations = specializations;
    }

    public List<String> getCertifications() {
        return certifications;
    }

    public void setCertifications(List<String> certifications) {
        this.certifications = certifications;
    }

    public ServiceCapabilities getServiceCapabilities() {
        return serviceCapabilities;
    }

    public void setServiceCapabilities(ServiceCapabilities serviceCapabilities) {
        this.serviceCapabilities = serviceCapabilities;
    }

    public static class ServiceCapabilities {
        private String projectScale;
        private String geographicCoverage;
        private List<String> specialEquipment;

        public ServiceCapabilities() {
        }

        public String getProjectScale() {
            return projectScale;
        }

        public void setProjectScale(String projectScale) {
            this.projectScale = projectScale;
        }

        public String getGeographicCoverage() {
            return geographicCoverage;
        }

        public void setGeographicCoverage(String geographicCoverage) {
            this.geographicCoverage = geographicCoverage;
        }

        public List<String> getSpecialEquipment() {
            return specialEquipment;
        }

        public void setSpecialEquipment(List<String> specialEquipment) {
            this.specialEquipment = specialEquipment;
        }
    }
}
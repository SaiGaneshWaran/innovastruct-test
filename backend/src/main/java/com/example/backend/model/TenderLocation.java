package com.example.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "tender_locations")
public class TenderLocation {
    @Id
    private String id;
    private String district;
    private Coordinates coordinates;
    private int tenderCount;
    private List<ActiveTender> activeTenders;
    private double totalValue;

    public static class Coordinates {
        private double lat;
        private double lng;

        public Coordinates() {
        }

        public Coordinates(double lat, double lng) {
            this.lat = lat;
            this.lng = lng;
        }

        public double getLat() {
            return lat;
        }

        public void setLat(double lat) {
            this.lat = lat;
        }

        public double getLng() {
            return lng;
        }

        public void setLng(double lng) {
            this.lng = lng;
        }
    }

    public static class ActiveTender {
        private String id;
        private String title;
        private double budget;

        public ActiveTender() {
        }

        public ActiveTender(String id, String title, double budget) {
            this.id = id;
            this.title = title;
            this.budget = budget;
        }

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public double getBudget() {
            return budget;
        }

        public void setBudget(double budget) {
            this.budget = budget;
        }
    }

    public TenderLocation() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public Coordinates getCoordinates() {
        return coordinates;
    }

    public void setCoordinates(Coordinates coordinates) {
        this.coordinates = coordinates;
    }

    public int getTenderCount() {
        return tenderCount;
    }

    public void setTenderCount(int tenderCount) {
        this.tenderCount = tenderCount;
    }

    public List<ActiveTender> getActiveTenders() {
        return activeTenders;
    }

    public void setActiveTenders(List<ActiveTender> activeTenders) {
        this.activeTenders = activeTenders;
    }

    public double getTotalValue() {
        return totalValue;
    }

    public void setTotalValue(double totalValue) {
        this.totalValue = totalValue;
    }
}
package com.example.backend.model;

public class Review {
    private String id;
    private String clientName;
    private double rating;
    private String text;
    private String date;

    public Review() {
    }

    public Review(String id, String clientName, double rating, String text, String date) {
        this.id = id;
        this.clientName = clientName;
        this.rating = rating;
        this.text = text;
        this.date = date;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }
}
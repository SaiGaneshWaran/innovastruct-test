package com.example.backend.model;

import java.util.List;

public class TrackRecord {
    private int yearsOfExperience;
    private List<NotableProject> notableProjects;
    private ClientSatisfaction clientSatisfaction;

    public TrackRecord() {
    }

    public int getYearsOfExperience() {
        return yearsOfExperience;
    }

    public void setYearsOfExperience(int yearsOfExperience) {
        this.yearsOfExperience = yearsOfExperience;
    }

    public List<NotableProject> getNotableProjects() {
        return notableProjects;
    }

    public void setNotableProjects(List<NotableProject> notableProjects) {
        this.notableProjects = notableProjects;
    }

    public ClientSatisfaction getClientSatisfaction() {
        return clientSatisfaction;
    }

    public void setClientSatisfaction(ClientSatisfaction clientSatisfaction) {
        this.clientSatisfaction = clientSatisfaction;
    }

    public static class NotableProject {
        private String title;
        private String image;
        private String description;

        public NotableProject() {
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getImage() {
            return image;
        }

        public void setImage(String image) {
            this.image = image;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }
    }

    public static class ClientSatisfaction {
        private double averageRating;
        private List<String> positiveFeedback;
        private List<String> challengesFaced;

        public ClientSatisfaction() {
        }

        public double getAverageRating() {
            return averageRating;
        }

        public void setAverageRating(double averageRating) {
            this.averageRating = averageRating;
        }

        public List<String> getPositiveFeedback() {
            return positiveFeedback;
        }

        public void setPositiveFeedback(List<String> positiveFeedback) {
            this.positiveFeedback = positiveFeedback;
        }

        public List<String> getChallengesFaced() {
            return challengesFaced;
        }

        public void setChallengesFaced(List<String> challengesFaced) {
            this.challengesFaced = challengesFaced;
        }
    }
}
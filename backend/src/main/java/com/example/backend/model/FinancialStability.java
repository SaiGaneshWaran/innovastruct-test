package com.example.backend.model;

import java.util.List;

public class FinancialStability {
    private String annualRevenue;
    private String growthRate;
    private String creditRating;
    private List<String> majorInvestors;
    private FinancialHealth financialHealth;

    public FinancialStability() {
    }

    public String getAnnualRevenue() {
        return annualRevenue;
    }

    public void setAnnualRevenue(String annualRevenue) {
        this.annualRevenue = annualRevenue;
    }

    public String getGrowthRate() {
        return growthRate;
    }

    public void setGrowthRate(String growthRate) {
        this.growthRate = growthRate;
    }

    public String getCreditRating() {
        return creditRating;
    }

    public void setCreditRating(String creditRating) {
        this.creditRating = creditRating;
    }

    public List<String> getMajorInvestors() {
        return majorInvestors;
    }

    public void setMajorInvestors(List<String> majorInvestors) {
        this.majorInvestors = majorInvestors;
    }

    public FinancialHealth getFinancialHealth() {
        return financialHealth;
    }

    public void setFinancialHealth(FinancialHealth financialHealth) {
        this.financialHealth = financialHealth;
    }

    public static class FinancialHealth {
        private String cashReserves;
        private String debtToEquityRatio;
        private String longTermStability;

        public FinancialHealth() {
        }

        public String getCashReserves() {
            return cashReserves;
        }

        public void setCashReserves(String cashReserves) {
            this.cashReserves = cashReserves;
        }

        public String getDebtToEquityRatio() {
            return debtToEquityRatio;
        }

        public void setDebtToEquityRatio(String debtToEquityRatio) {
            this.debtToEquityRatio = debtToEquityRatio;
        }

        public String getLongTermStability() {
            return longTermStability;
        }

        public void setLongTermStability(String longTermStability) {
            this.longTermStability = longTermStability;
        }
    }
}
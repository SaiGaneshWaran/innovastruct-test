package com.example.backend.service;

import com.example.backend.model.Bid;
import com.example.backend.model.Tender;
import com.example.backend.model.Company;
import com.example.backend.repository.BidRepository;
import com.example.backend.repository.TenderRepository;
import com.example.backend.repository.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import java.util.DoubleSummaryStatistics;

@Service
public class BidAnalyticsService {

    @Autowired
    private BidRepository bidRepository;

    @Autowired
    private TenderRepository tenderRepository;

    @Autowired
    private CompanyRepository companyRepository;

    /**
     * Get success rate for a company over a period
     * @param companyId The company ID
     * @param months Number of months to look back
     * @return Map with month labels and success rate percentages
     */
    public Map<String, Object> getBidSuccessRate(String companyId, int months) {
        List<Bid> companyBids = bidRepository.findByCompanyId(companyId);

        // Get current date and calculate start date based on months parameter
        LocalDateTime endDate = LocalDateTime.now();
        LocalDateTime startDate = endDate.minusMonths(months);

        // Filter bids by date range
        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
        List<Bid> filteredBids = companyBids.stream()
                .filter(bid -> {
                    LocalDateTime bidDate = LocalDateTime.parse(bid.getCreatedAt(), formatter);
                    return !bidDate.isBefore(startDate) && !bidDate.isAfter(endDate);
                })
                .collect(Collectors.toList());

        // Group bids by month
        Map<String, List<Bid>> bidsByMonth = new LinkedHashMap<>();

        // Initialize months
        for (int i = 0; i < months; i++) {
            LocalDateTime date = endDate.minusMonths(months - 1 - i);
            String monthLabel = date.format(DateTimeFormatter.ofPattern("MMM"));
            bidsByMonth.put(monthLabel, new ArrayList<>());
        }

        // Populate bids by month
        for (Bid bid : filteredBids) {
            LocalDateTime bidDate = LocalDateTime.parse(bid.getCreatedAt(), formatter);
            String monthLabel = bidDate.format(DateTimeFormatter.ofPattern("MMM"));
            if (bidsByMonth.containsKey(monthLabel)) {
                bidsByMonth.get(monthLabel).add(bid);
            }
        }

        // Calculate success rate for each month
        List<String> labels = new ArrayList<>(bidsByMonth.keySet());
        List<Double> successRates = new ArrayList<>();

        for (String month : labels) {
            List<Bid> monthBids = bidsByMonth.get(month);
            if (monthBids.isEmpty()) {
                successRates.add(0.0);
            } else {
                long acceptedBids = monthBids.stream()
                        .filter(bid -> "accepted".equals(bid.getStatus()))
                        .count();
                double successRate = (double) acceptedBids / monthBids.size() * 100;
                successRates.add(successRate);
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("labels", labels);
        result.put("data", successRates);
        return result;
    }

    /**
     * Get bid volume by month
     * @param companyId The company ID
     * @param months Number of months to look back
     * @return Map with month labels and bid counts
     */
    public Map<String, Object> getBidVolume(String companyId, int months) {
        List<Bid> companyBids = bidRepository.findByCompanyId(companyId);

        // Get current date and calculate start date based on months parameter
        LocalDateTime endDate = LocalDateTime.now();
        LocalDateTime startDate = endDate.minusMonths(months);

        // Filter bids by date range
        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
        List<Bid> filteredBids = companyBids.stream()
                .filter(bid -> {
                    LocalDateTime bidDate = LocalDateTime.parse(bid.getCreatedAt(), formatter);
                    return !bidDate.isBefore(startDate) && !bidDate.isAfter(endDate);
                })
                .collect(Collectors.toList());

        // Group bids by month
        Map<String, List<Bid>> bidsByMonth = new LinkedHashMap<>();

        // Initialize months
        for (int i = 0; i < months; i++) {
            LocalDateTime date = endDate.minusMonths(months - 1 - i);
            String monthLabel = date.format(DateTimeFormatter.ofPattern("MMM"));
            bidsByMonth.put(monthLabel, new ArrayList<>());
        }

        // Populate bids by month
        for (Bid bid : filteredBids) {
            LocalDateTime bidDate = LocalDateTime.parse(bid.getCreatedAt(), formatter);
            String monthLabel = bidDate.format(DateTimeFormatter.ofPattern("MMM"));
            if (bidsByMonth.containsKey(monthLabel)) {
                bidsByMonth.get(monthLabel).add(bid);
            }
        }

        // Count bids for each month
        List<String> labels = new ArrayList<>(bidsByMonth.keySet());
        List<Integer> bidCounts = new ArrayList<>();

        for (String month : labels) {
            bidCounts.add(bidsByMonth.get(month).size());
        }

        Map<String, Object> result = new HashMap<>();
        result.put("labels", labels);
        result.put("data", bidCounts);
        return result;
    }

    /**
     * Get bid status distribution
     * @param companyId The company ID
     * @return Map with status labels and counts
     */
    public Map<String, Object> getBidDistribution(String companyId) {
        List<Bid> companyBids = bidRepository.findByCompanyId(companyId);

        long acceptedCount = companyBids.stream()
                .filter(bid -> "accepted".equals(bid.getStatus()))
                .count();

        long rejectedCount = companyBids.stream()
                .filter(bid -> "rejected".equals(bid.getStatus()))
                .count();

        long pendingCount = companyBids.stream()
                .filter(bid -> "pending".equals(bid.getStatus()))
                .count();

        List<String> labels = Arrays.asList("Won", "Lost", "Pending");
        List<Long> data = Arrays.asList(acceptedCount, rejectedCount, pendingCount);

        Map<String, Object> result = new HashMap<>();
        result.put("labels", labels);
        result.put("data", data);
        return result;
    }

    /**
     * Get overall bid statistics
     * @param companyId The company ID
     * @return Map with various statistics
     */
    public Map<String, Object> getBidStatistics(String companyId) {
        List<Bid> companyBids = bidRepository.findByCompanyId(companyId);

        // Calculate success rate
        double successRate = 0;
        if (!companyBids.isEmpty()) {
            long acceptedBids = companyBids.stream()
                    .filter(bid -> "accepted".equals(bid.getStatus()))
                    .count();
            successRate = (double) acceptedBids / companyBids.size() * 100;
        }

        // Calculate average bid value
        OptionalDouble averageBidOpt = companyBids.stream()
                .mapToDouble(Bid::getAmount)
                .average();
        double averageBid = averageBidOpt.orElse(0);

        // Count total bids
        int totalBids = companyBids.size();

        // Count active (accepted) bids
        long activeBids = companyBids.stream()
                .filter(bid -> "accepted".equals(bid.getStatus()))
                .count();

        // Count pending bids
        long pendingBids = companyBids.stream()
                .filter(bid -> "pending".equals(bid.getStatus()))
                .count();

        // Get previous period statistics for comparison
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime oneMonthAgo = now.minusMonths(1);
        LocalDateTime twoMonthsAgo = now.minusMonths(2);

        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;

        // Current period bids
        List<Bid> currentPeriodBids = companyBids.stream()
                .filter(bid -> {
                    LocalDateTime bidDate = LocalDateTime.parse(bid.getCreatedAt(), formatter);
                    return bidDate.isAfter(oneMonthAgo) && bidDate.isBefore(now);
                })
                .collect(Collectors.toList());

        // Previous period bids
        List<Bid> previousPeriodBids = companyBids.stream()
                .filter(bid -> {
                    LocalDateTime bidDate = LocalDateTime.parse(bid.getCreatedAt(), formatter);
                    return bidDate.isAfter(twoMonthsAgo) && bidDate.isBefore(oneMonthAgo);
                })
                .collect(Collectors.toList());

        Map<String, Object> result = new HashMap<>();
        result.put("activeBids", activeBids);
        result.put("pendingBids", pendingBids);
        result.put("totalBids", totalBids);
        result.put("successRate", successRate);
        result.put("averageBid", averageBid);

        // Calculate period-over-period changes
        if (!currentPeriodBids.isEmpty() && !previousPeriodBids.isEmpty()) {
            long currentActiveBids = currentPeriodBids.stream()
                    .filter(bid -> "accepted".equals(bid.getStatus()))
                    .count();
            long previousActiveBids = previousPeriodBids.stream()
                    .filter(bid -> "accepted".equals(bid.getStatus()))
                    .count();
            result.put("activeBidsChange", calculatePercentageChange(previousActiveBids, currentActiveBids));

            long currentPendingBids = currentPeriodBids.stream()
                    .filter(bid -> "pending".equals(bid.getStatus()))
                    .count();
            long previousPendingBids = previousPeriodBids.stream()
                    .filter(bid -> "pending".equals(bid.getStatus()))
                    .count();
            result.put("pendingBidsChange", calculatePercentageChange(previousPendingBids, currentPendingBids));
        }

        return result;
    }

    private double calculatePercentageChange(long previous, long current) {
        if (previous == 0) {
            return current > 0 ? 100 : 0;
        }
        return ((double) (current - previous) / previous) * 100;
    }

    /**
     * Get performance metrics
     * @param companyId The company ID
     * @return Map with performance metrics
     */
    public Map<String, Object> getPerformanceMetrics(String companyId) {
        List<Bid> companyBids = bidRepository.findByCompanyId(companyId);
        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;

        // Calculate average response time (time between tender creation and bid submission)
        double averageResponseTime = 0;
        int responseTimeCount = 0;

        for (Bid bid : companyBids) {
            // Get associated tender for this bid
            Optional<Tender> tenderOpt = tenderRepository.findById(bid.getTenderId());
            if (tenderOpt.isPresent()) {
                Tender tender = tenderOpt.get();
                LocalDateTime tenderCreationDate = LocalDateTime.parse(tender.getCreatedAt(), formatter);
                LocalDateTime bidCreationDate = LocalDateTime.parse(bid.getCreatedAt(), formatter);

                // Calculate days between tender creation and bid submission
                long daysBetween = java.time.Duration.between(tenderCreationDate, bidCreationDate).toDays();
                averageResponseTime += daysBetween;
                responseTimeCount++;
            }
        }

        if (responseTimeCount > 0) {
            averageResponseTime /= responseTimeCount;
        }

        // Calculate win rate by value
        double totalBidValue = companyBids.stream()
                .mapToDouble(Bid::getAmount)
                .sum();

        double wonBidValue = companyBids.stream()
                .filter(bid -> "accepted".equals(bid.getStatus()))
                .mapToDouble(Bid::getAmount)
                .sum();

        double winRateByValue = totalBidValue == 0 ? 0 : (wonBidValue / totalBidValue) * 100;

        // Calculate competitive index based on:
        // 1. Win rate
        // 2. Average bid amount compared to tender budget
        // 3. Response time performance
        double competitiveIndex = 0;
        int competitiveFactors = 0;

        // Factor 1: Win rate contribution (max 10 points)
        if (totalBidValue > 0) {
            competitiveIndex += (winRateByValue / 100) * 10;
            competitiveFactors++;
        }

        // Factor 2: Bid pricing competitiveness
        double avgPricingCompetitiveness = 0;
        int pricingCount = 0;

        for (Bid bid : companyBids) {
            Optional<Tender> tenderOpt = tenderRepository.findById(bid.getTenderId());
            if (tenderOpt.isPresent()) {
                Tender tender = tenderOpt.get();
                if (tender.getBudget() > 0) {
                    double bidRatio = bid.getAmount() / tender.getBudget();
                    // Score higher for bids closer to budget (max 10 points)
                    avgPricingCompetitiveness += Math.max(0, 10 - Math.abs(1 - bidRatio) * 10);
                    pricingCount++;
                }
            }
        }

        if (pricingCount > 0) {
            avgPricingCompetitiveness /= pricingCount;
            competitiveIndex += avgPricingCompetitiveness;
            competitiveFactors++;
        }

        // Factor 3: Response time performance (max 10 points)
        if (responseTimeCount > 0) {
            // Assume optimal response time is 3 days or less
            double responseTimeScore = Math.max(0, 10 - (averageResponseTime - 3));
            competitiveIndex += responseTimeScore;
            competitiveFactors++;
        }

        // Calculate final competitive index as average of available factors
        if (competitiveFactors > 0) {
            competitiveIndex /= competitiveFactors;
        }

        // Calculate average markup compared to market average
        double averageMarkup = 0;
        int markupCount = 0;

        for (Bid bid : companyBids) {
            Optional<Tender> tenderOpt = tenderRepository.findById(bid.getTenderId());
            if (tenderOpt.isPresent()) {
                Tender tender = tenderOpt.get();
                if (tender.getBudget() > 0) {
                    double markup = ((bid.getAmount() - tender.getBudget()) / tender.getBudget()) * 100;
                    averageMarkup += markup;
                    markupCount++;
                }
            }
        }

        if (markupCount > 0) {
            averageMarkup /= markupCount;
        }

        Map<String, Object> result = new HashMap<>();
        result.put("averageResponseTime", Math.round(averageResponseTime * 10.0) / 10.0); // Round to 1 decimal
        result.put("winRateByValue", Math.round(winRateByValue * 10.0) / 10.0);
        result.put("competitiveIndex", Math.round(competitiveIndex * 10.0) / 10.0);
        result.put("averageMarkup", Math.round(averageMarkup * 10.0) / 10.0);

        return result;
    }

    /**
     * Get bid trends data by category
     * @param timeframe The timeframe to analyze (day, week, month, quarter, year)
     * @return List of bid trend data objects with current and previous period comparisons
     */
    public List<Map<String, Object>> getBidTrends(String timeframe) {
        List<Bid> allBids = bidRepository.findAll();
        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;

        // Define the current and previous time periods based on the timeframe parameter
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime currentPeriodStart;
        LocalDateTime previousPeriodStart;
        LocalDateTime previousPeriodEnd;

        switch (timeframe.toLowerCase()) {
            case "day":
                currentPeriodStart = now.minusDays(7); // Last 7 days
                previousPeriodStart = currentPeriodStart.minusDays(7); // Previous 7 days
                previousPeriodEnd = currentPeriodStart;
                break;
            case "week":
                currentPeriodStart = now.minusWeeks(4); // Last 4 weeks
                previousPeriodStart = currentPeriodStart.minusWeeks(4); // Previous 4 weeks
                previousPeriodEnd = currentPeriodStart;
                break;
            case "quarter":
                currentPeriodStart = now.minusMonths(3); // Last quarter
                previousPeriodStart = currentPeriodStart.minusMonths(3); // Previous quarter
                previousPeriodEnd = currentPeriodStart;
                break;
            case "year":
                currentPeriodStart = now.minusMonths(12); // Last year
                previousPeriodStart = currentPeriodStart.minusMonths(12); // Previous year
                previousPeriodEnd = currentPeriodStart;
                break;
            case "month":
            default:
                currentPeriodStart = now.minusMonths(1); // Last month
                previousPeriodStart = currentPeriodStart.minusMonths(1); // Previous month
                previousPeriodEnd = currentPeriodStart;
                break;
        }

        // Filter bids for current period
        List<Bid> currentPeriodBids = allBids.stream()
                .filter(bid -> {
                    LocalDateTime bidDate = LocalDateTime.parse(bid.getCreatedAt(), formatter);
                    return bidDate.isAfter(currentPeriodStart) && bidDate.isBefore(now);
                })
                .collect(Collectors.toList());

        // Filter bids for previous period
        List<Bid> previousPeriodBids = allBids.stream()
                .filter(bid -> {
                    LocalDateTime bidDate = LocalDateTime.parse(bid.getCreatedAt(), formatter);
                    return bidDate.isAfter(previousPeriodStart) && bidDate.isBefore(previousPeriodEnd);
                })
                .collect(Collectors.toList());

        // Define categories based on company types
        List<String> categories = Arrays.asList("Commercial", "Residential", "Industrial");
        List<Map<String, Object>> result = new ArrayList<>();

        // Calculate trends for each category
        for (String category : categories) {
            long currentCount = countBidsByCompanyType(currentPeriodBids, category);
            long previousCount = countBidsByCompanyType(previousPeriodBids, category);
            double percentageChange = previousCount > 0
                ? ((currentCount - previousCount) / (double) previousCount) * 100
                : 0;

            Map<String, Object> categoryData = new HashMap<>();
            categoryData.put("category", category);
            categoryData.put("currentMonthBids", currentCount);
            categoryData.put("previousMonthBids", previousCount);
            categoryData.put("percentageChange", Math.round(percentageChange * 10.0) / 10.0);
            result.add(categoryData);
        }

        return result;
    }

    /**
     * Helper method to count bids by company type
     */
    private long countBidsByCompanyType(List<Bid> bids, String companyType) {
        return bids.stream()
                .filter(bid -> {
                    Optional<Company> company = companyRepository.findById(bid.getCompanyId());
                    return company.map(c -> c.getType().equals(companyType)).orElse(false);
                })
                .count();
    }

    /**
     * Get project timeline data by project type
     * @param projectType The type of project to analyze (optional)
     * @return Map with timeline data for projects
     */
    public Map<String, Object> getProjectTimelines(String projectType) {
        // Get all tenders (projects)
        List<Tender> allTenders = tenderRepository.findAll();

        // Filter by project type if specified
        List<Tender> filteredTenders = allTenders;
        if (projectType != null && !projectType.isEmpty() && !projectType.equalsIgnoreCase("all")) {
            // Filter based on winning bid's company type
            filteredTenders = allTenders.stream()
                    .filter(tender -> {
                        if (tender.getBidIds() != null && !tender.getBidIds().isEmpty()) {
                            List<Bid> bids = bidRepository.findAllById(tender.getBidIds());
                            Optional<Bid> winningBid = bids.stream()
                                    .filter(bid -> "accepted".equals(bid.getStatus()))
                                    .findFirst();

                            if (winningBid.isPresent()) {
                                Optional<Company> company = companyRepository.findById(winningBid.get().getCompanyId());
                                return company.map(c -> c.getType().equals(projectType)).orElse(false);
                            }
                        }
                        return false;
                    })
                    .collect(Collectors.toList());
        }

        // Calculate average timeline metrics
        Map<String, Object> result = new HashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;

        // Define categories based on company types
        List<String> categories = Arrays.asList("Commercial", "Residential", "Industrial");
        Map<String, List<Map<String, Object>>> projectsByCategory = new HashMap<>();

        // Initialize category maps
        for (String category : categories) {
            projectsByCategory.put(category, new ArrayList<>());
        }

        // Process each tender and categorize by winning company's type
        for (Tender tender : filteredTenders) {
            if (tender.getBidIds() != null && !tender.getBidIds().isEmpty()) {
                List<Bid> bids = bidRepository.findAllById(tender.getBidIds());
                Optional<Bid> winningBid = bids.stream()
                        .filter(bid -> "accepted".equals(bid.getStatus()))
                        .findFirst();

                if (winningBid.isPresent()) {
                    Optional<Company> company = companyRepository.findById(winningBid.get().getCompanyId());
                    if (company.isPresent()) {
                        String companyType = company.get().getType();
                        if (categories.contains(companyType)) {
                            // Calculate project metrics
                            LocalDateTime tenderCreationDate = LocalDateTime.parse(tender.getCreatedAt(), formatter);
                            LocalDateTime proposedDeadline = LocalDateTime.parse(winningBid.get().getProposedDeadline(), formatter);
                            long durationDays = java.time.Duration.between(tenderCreationDate, proposedDeadline).toDays();

                            Map<String, Object> projectData = new HashMap<>();
                            projectData.put("name", tender.getTitle());
                            projectData.put("duration", durationDays);
                            projectData.put("budget", tender.getBudget());
                            projectData.put("actualCost", winningBid.get().getAmount());
                            projectData.put("budgetVariance",
                                ((winningBid.get().getAmount() - tender.getBudget()) / tender.getBudget()) * 100);

                            projectsByCategory.get(companyType).add(projectData);
                        }
                    }
                }
            }
        }

        // Calculate summary metrics for each category
        Map<String, Map<String, Object>> categoryStats = new HashMap<>();

        for (String category : categories) {
            List<Map<String, Object>> categoryProjects = projectsByCategory.get(category);
            Map<String, Object> stats = new HashMap<>();

            if (!categoryProjects.isEmpty()) {
                // Calculate averages
                double avgDuration = categoryProjects.stream()
                        .mapToLong(p -> ((Number) p.get("duration")).longValue())
                        .average()
                        .orElse(0);

                double avgBudgetVariance = categoryProjects.stream()
                        .mapToDouble(p -> ((Number) p.get("budgetVariance")).doubleValue())
                        .average()
                        .orElse(0);

                stats.put("averageDuration", Math.round(avgDuration * 10.0) / 10.0);
                stats.put("averageBudgetVariance", Math.round(avgBudgetVariance * 10.0) / 10.0);
                stats.put("totalProjects", categoryProjects.size());
            } else {
                stats.put("averageDuration", 0.0);
                stats.put("averageBudgetVariance", 0.0);
                stats.put("totalProjects", 0);
            }

            categoryStats.put(category, stats);
        }

        result.put("categories", categoryStats);
        result.put("projectsByCategory", projectsByCategory);

        return result;
    }

    /**
     * Get client preferences data
     * @return Map with client preference data
     */
    public Map<String, Object> getClientPreferences() {
        Map<String, Object> result = new HashMap<>();

        // Get all tenders from the database
        List<Tender> allTenders = tenderRepository.findAll();

        // Define categories based on company types
        List<String> categories = Arrays.asList("Commercial", "Residential", "Industrial");

        // Count tenders by category
        Map<String, Integer> categoryCounts = new HashMap<>();
        for (String category : categories) {
            categoryCounts.put(category, 0);
        }

        // For each tender, find the winning bid and get the company type
        for (Tender tender : allTenders) {
            if (tender.getBidIds() != null && !tender.getBidIds().isEmpty()) {
                List<Bid> bids = bidRepository.findAllById(tender.getBidIds());
                Optional<Bid> winningBid = bids.stream()
                        .filter(bid -> "accepted".equals(bid.getStatus()))
                        .findFirst();

                if (winningBid.isPresent()) {
                    Optional<Company> company = companyRepository.findById(winningBid.get().getCompanyId());
                    if (company.isPresent()) {
                        String companyType = company.get().getType();
                        if (categories.contains(companyType)) {
                            categoryCounts.merge(companyType, 1, Integer::sum);
                        }
                    }
                }
            }
        }

        // Calculate total count for percentage calculation
        int totalCount = categoryCounts.values().stream().mapToInt(Integer::intValue).sum();

        // Get tenders from previous period (3 months ago) for trend calculation
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime threeMonthsAgo = now.minusMonths(3);
        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;

        Map<String, Integer> previousCategoryCounts = new HashMap<>();
        for (String category : categories) {
            previousCategoryCounts.put(category, 0);
        }

        // Filter tenders from previous period
        List<Tender> previousTenders = allTenders.stream()
            .filter(tender -> {
                LocalDateTime tenderDate = LocalDateTime.parse(tender.getCreatedAt(), formatter);
                return tenderDate.isBefore(threeMonthsAgo);
            })
            .collect(Collectors.toList());

        // Categorize previous period tenders based on winning company type
        for (Tender tender : previousTenders) {
            if (tender.getBidIds() != null && !tender.getBidIds().isEmpty()) {
                List<Bid> bids = bidRepository.findAllById(tender.getBidIds());
                Optional<Bid> winningBid = bids.stream()
                        .filter(bid -> "accepted".equals(bid.getStatus()))
                        .findFirst();

                if (winningBid.isPresent()) {
                    Optional<Company> company = companyRepository.findById(winningBid.get().getCompanyId());
                    if (company.isPresent()) {
                        String companyType = company.get().getType();
                        if (categories.contains(companyType)) {
                            previousCategoryCounts.merge(companyType, 1, Integer::sum);
                        }
                    }
                }
            }
        }

        // Create preference data with real values
        List<Map<String, Object>> preferenceData = new ArrayList<>();

        for (String category : categories) {
            Map<String, Object> categoryData = new HashMap<>();
            categoryData.put("name", category);

            int count = categoryCounts.get(category);
            int previousCount = previousCategoryCounts.get(category);

            // Calculate percentage value
            double value = totalCount > 0 ? (double) count / totalCount * 100 : 0;
            categoryData.put("value", Math.round(value));
            categoryData.put("count", count);

            // Calculate trend
            String trend = "0%";
            if (previousCount > 0) {
                double trendValue = ((double) count - previousCount) / previousCount * 100;
                trend = (trendValue >= 0 ? "+" : "") + Math.round(trendValue) + "%";
            }
            categoryData.put("trend", trend);

            preferenceData.add(categoryData);
        }

        result.put("preferenceData", preferenceData);
        return result;
    }

    /**
     * Get tender activity statistics
     * @return Map with tender activity data
     */
    public Map<String, Object> getTenderActivity() {
        Map<String, Object> result = new HashMap<>();

        // Get all tenders from the database
        List<Tender> allTenders = tenderRepository.findAll();
        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;

        // Define the last 6 months for analysis
        LocalDateTime now = LocalDateTime.now();
        List<String> months = new ArrayList<>();
        List<LocalDateTime> monthStarts = new ArrayList<>();
        List<LocalDateTime> monthEnds = new ArrayList<>();

        // Generate month labels and date ranges
        for (int i = 5; i >= 0; i--) {
            LocalDateTime monthStart = now.minusMonths(i).withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
            LocalDateTime monthEnd;
            if (i > 0) {
                monthEnd = now.minusMonths(i-1).withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0).minusSeconds(1);
            } else {
                // For current month, use current date as end
                monthEnd = now;
            }

            String monthLabel = monthStart.format(DateTimeFormatter.ofPattern("MMM"));
            months.add(monthLabel);
            monthStarts.add(monthStart);
            monthEnds.add(monthEnd);
        }

        // Count tenders by month
        List<Integer> tenderCounts = new ArrayList<>();
        List<String> growthRates = new ArrayList<>();

        // Previous month counts for growth calculation
        int previousMonthCount = 0;

        // Process each month
        for (int i = 0; i < months.size(); i++) {
            final int index = i; // Need final variable for lambda

            // Count tenders created in this month
            long count = allTenders.stream()
                .filter(tender -> {
                    LocalDateTime tenderDate = LocalDateTime.parse(tender.getCreatedAt(), formatter);
                    return !tenderDate.isBefore(monthStarts.get(index)) && !tenderDate.isAfter(monthEnds.get(index));
                })
                .count();

            tenderCounts.add((int) count);

            // Calculate growth rate compared to previous month
            String growth = "0%";
            if (i > 0 && previousMonthCount > 0) {
                double growthRate = ((double) count - previousMonthCount) / previousMonthCount * 100;
                growth = (growthRate >= 0 ? "+" : "") + Math.round(growthRate) + "%";
            }
            growthRates.add(growth);

            previousMonthCount = (int) count;
        }

        // Create tender data with real values
        List<Map<String, Object>> tenderData = new ArrayList<>();

        for (int i = 0; i < months.size(); i++) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("month", months.get(i));
            entry.put("tenders", tenderCounts.get(i));
            entry.put("growth", growthRates.get(i));
            tenderData.add(entry);
        }

        result.put("tenderData", tenderData);
        return result;
    }

    /**
     * Get detailed bid analytics by category for a company
     * @param companyId The company ID
     * @return Map with categories and their bid statistics
     */
    public Map<String, Object> getBidAnalytics(String companyId) {
        // Get all bids for the company
        List<Bid> companyBids = bidRepository.findByCompanyId(companyId);

        // Get company type
        Optional<Company> companyOpt = companyRepository.findById(companyId);
        if (!companyOpt.isPresent()) {
            throw new RuntimeException("Company not found with id " + companyId);
        }
        String companyType = companyOpt.get().getType();

        // Get all tenders for these bids
        Set<String> tenderIds = companyBids.stream()
                .map(Bid::getTenderId)
                .collect(Collectors.toSet());
        List<Tender> relatedTenders = tenderRepository.findAllById(tenderIds);

        // Create a map of tender ID to tender for easy lookup
        Map<String, Tender> tenderMap = relatedTenders.stream()
                .collect(Collectors.toMap(Tender::getId, tender -> tender));

        // Group bids by project category
        Map<String, List<Bid>> bidsByCategory = new HashMap<>();
        Map<String, List<Tender>> tendersByCategory = new HashMap<>();

        // Define categories based on company types
        List<String> categories = Arrays.asList("Commercial", "Residential", "Industrial");

        // Initialize category maps
        for (String category : categories) {
            bidsByCategory.put(category, new ArrayList<>());
            tendersByCategory.put(category, new ArrayList<>());
        }

        // Categorize bids and tenders based on company type
        for (Bid bid : companyBids) {
            Tender tender = tenderMap.get(bid.getTenderId());
            if (tender != null) {
                bidsByCategory.computeIfAbsent(companyType, k -> new ArrayList<>()).add(bid);
                tendersByCategory.computeIfAbsent(companyType, k -> new ArrayList<>()).add(tender);
            }
        }

        // Calculate statistics for each category
        Map<String, Map<String, Object>> categoryStats = new HashMap<>();
        int totalProjects = 0;
        int totalBids = 0;
        double overallMinBid = Double.MAX_VALUE;
        double overallMaxBid = 0;
        double overallTotalBid = 0;
        int overallBidCount = 0;

        for (String category : categories) {
            List<Bid> categoryBids = bidsByCategory.get(category);
            List<Tender> categoryTenders = tendersByCategory.get(category);

            if (!categoryBids.isEmpty()) {
                // Calculate bid statistics
                DoubleSummaryStatistics bidStats = categoryBids.stream()
                        .mapToDouble(Bid::getAmount)
                        .summaryStatistics();

                Map<String, Object> stats = new HashMap<>();
                stats.put("count", categoryTenders.size());
                stats.put("totalBids", categoryBids.size());
                stats.put("minBid", bidStats.getMin());
                stats.put("maxBid", bidStats.getMax());
                stats.put("avgBid", bidStats.getAverage());

                categoryStats.put(category, stats);

                // Update overall statistics
                totalProjects += categoryTenders.size();
                totalBids += categoryBids.size();
                overallMinBid = Math.min(overallMinBid, bidStats.getMin());
                overallMaxBid = Math.max(overallMaxBid, bidStats.getMax());
                overallTotalBid += bidStats.getSum();
                overallBidCount += categoryBids.size();
            } else {
                // Initialize empty category stats
                Map<String, Object> stats = new HashMap<>();
                stats.put("count", 0);
                stats.put("totalBids", 0);
                stats.put("minBid", 0.0);
                stats.put("maxBid", 0.0);
                stats.put("avgBid", 0.0);
                categoryStats.put(category, stats);
            }
        }

        // Create summary statistics
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalProjects", totalProjects);
        summary.put("totalBids", totalBids);
        summary.put("overallMinBid", overallMinBid == Double.MAX_VALUE ? 0 : overallMinBid);
        summary.put("overallMaxBid", overallMaxBid);
        summary.put("overallAvgBid", overallBidCount > 0 ? overallTotalBid / overallBidCount : 0);

        // Prepare final result
        Map<String, Object> result = new HashMap<>();
        result.put("categories", categoryStats);
        result.put("summary", summary);

        return result;
    }
}
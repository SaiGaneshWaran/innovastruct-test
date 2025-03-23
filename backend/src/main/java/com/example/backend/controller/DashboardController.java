package com.example.backend.controller;

import com.example.backend.model.Bid;
import com.example.backend.model.Tender;
import com.example.backend.repository.BidRepository;
import com.example.backend.repository.CompanyRepository;
import com.example.backend.repository.TenderRepository;
import com.example.backend.service.BidAnalyticsService;
import com.example.backend.service.TenderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(maxAge = 3600)
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private TenderRepository tenderRepository;

    @Autowired
    private BidRepository bidRepository;

    @Autowired
    private BidAnalyticsService bidAnalyticsService;

    @Autowired
    private TenderService tenderService;

    @Autowired
    private CompanyRepository companyRepository;

    /**
     * Get summary statistics for client dashboard
     * @return Map with various statistics
     */
    @GetMapping("/client/summary")
    public ResponseEntity<Map<String, Object>> getClientDashboardSummary() {
        Map<String, Object> result = new HashMap<>();

        // Get all tenders
        List<Tender> allTenders = tenderRepository.findAll();

        // Count total tenders
        result.put("totalTenders", allTenders.size());

        // Count active tenders
        long activeTenders = allTenders.stream()
                .filter(tender -> "active".equals(tender.getStatus()))
                .count();
        result.put("activeTenders", activeTenders);

        // Count completed tenders
        long completedTenders = allTenders.stream()
                .filter(tender -> "ended".equals(tender.getStatus()))
                .count();
        result.put("completedTenders", completedTenders);

        // Calculate total budget
        double totalBudget = allTenders.stream()
                .mapToDouble(Tender::getBudget)
                .sum();
        result.put("totalBudget", totalBudget);

        // Get all bids
        List<Bid> allBids = bidRepository.findAll();

        // Count total bids
        result.put("totalBids", allBids.size());

        // Count accepted bids
        long acceptedBids = allBids.stream()
                .filter(bid -> "accepted".equals(bid.getStatus()))
                .count();
        result.put("acceptedBids", acceptedBids);

        // Count total companies
        result.put("totalCompanies", companyRepository.count());

        return ResponseEntity.ok(result);
    }

    /**
     * Get recent tender activity for client dashboard
     * @param limit Number of recent tenders to return
     * @return List of recent tenders with bid information
     */
    @GetMapping("/client/recent-activity")
    public ResponseEntity<List<Map<String, Object>>> getRecentTenderActivity(
            @RequestParam(defaultValue = "5") int limit) {

        // Get all tenders
        List<Tender> allTenders = tenderRepository.findAll();

        // Sort by creation date (newest first)
        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
        allTenders.sort((t1, t2) -> {
            LocalDateTime date1 = LocalDateTime.parse(t1.getCreatedAt(), formatter);
            LocalDateTime date2 = LocalDateTime.parse(t2.getCreatedAt(), formatter);
            return date2.compareTo(date1);
        });

        // Take only the requested number of tenders
        List<Tender> recentTenders = allTenders.stream()
                .limit(limit)
                .collect(Collectors.toList());

        // Transform to response format
        List<Map<String, Object>> result = new ArrayList<>();
        for (Tender tender : recentTenders) {
            Map<String, Object> tenderData = new HashMap<>();
            tenderData.put("id", tender.getId());
            tenderData.put("title", tender.getTitle());
            tenderData.put("status", tender.getStatus());
            tenderData.put("budget", tender.getBudget());
            tenderData.put("bidsCount", tender.getBidsCount());
            tenderData.put("createdAt", tender.getCreatedAt());
            tenderData.put("deadline", tender.getDeadline());

            result.add(tenderData);
        }

        return ResponseEntity.ok(result);
    }

    /**
     * Get tender status distribution for client dashboard
     * @return Map with status labels and counts
     */
    @GetMapping("/client/tender-status")
    public ResponseEntity<Map<String, Object>> getTenderStatusDistribution() {
        // Get all tenders
        List<Tender> allTenders = tenderRepository.findAll();

        // Count tenders by status
        long newCount = allTenders.stream()
                .filter(tender -> "new".equals(tender.getStatus()))
                .count();

        long activeCount = allTenders.stream()
                .filter(tender -> "active".equals(tender.getStatus()))
                .count();

        long endedCount = allTenders.stream()
                .filter(tender -> "ended".equals(tender.getStatus()))
                .count();

        List<String> labels = Arrays.asList("New", "Active", "Ended");
        List<Long> data = Arrays.asList(newCount, activeCount, endedCount);

        Map<String, Object> result = new HashMap<>();
        result.put("labels", labels);
        result.put("data", data);

        return ResponseEntity.ok(result);
    }

    /**
     * Get bid activity by month for client dashboard
     * @param months Number of months to look back
     * @return Map with month labels and bid counts
     */
    @GetMapping("/client/bid-activity")
    public ResponseEntity<Map<String, Object>> getBidActivityByMonth(
            @RequestParam(defaultValue = "6") int months) {

        // Get all bids
        List<Bid> allBids = bidRepository.findAll();

        // Get current date and calculate start date based on months parameter
        LocalDateTime endDate = LocalDateTime.now();
        LocalDateTime startDate = endDate.minusMonths(months);

        // Filter bids by date range
        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
        List<Bid> filteredBids = allBids.stream()
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

        return ResponseEntity.ok(result);
    }

    /**
     * Get budget utilization statistics for client dashboard
     * @return Map with budget statistics
     */
    @GetMapping("/client/budget-utilization")
    public ResponseEntity<Map<String, Object>> getBudgetUtilization() {
        // Get all tenders
        List<Tender> allTenders = tenderRepository.findAll();

        // Calculate total budget
        double totalBudget = allTenders.stream()
                .mapToDouble(Tender::getBudget)
                .sum();

        // Calculate utilized budget (based on accepted bids)
        double utilizedBudget = 0;
        for (Tender tender : allTenders) {
            if (tender.getBidIds() != null) {
                List<Bid> bids = bidRepository.findAllById(tender.getBidIds());
                for (Bid bid : bids) {
                    if ("accepted".equals(bid.getStatus())) {
                        utilizedBudget += bid.getAmount();
                        break; // Only count one accepted bid per tender
                    }
                }
            }
        }

        // Calculate remaining budget
        double remainingBudget = totalBudget - utilizedBudget;

        // Calculate utilization percentage
        double utilizationPercentage = totalBudget > 0 ? (utilizedBudget / totalBudget) * 100 : 0;

        Map<String, Object> result = new HashMap<>();
        result.put("totalBudget", totalBudget);
        result.put("utilizedBudget", utilizedBudget);
        result.put("remainingBudget", remainingBudget);
        result.put("utilizationPercentage", utilizationPercentage);

        return ResponseEntity.ok(result);
    }

    /**
     * Get company performance metrics for client dashboard
     * @param limit Number of top companies to return
     * @return List of top performing companies
     */
    @GetMapping("/client/top-companies")
    public ResponseEntity<List<Map<String, Object>>> getTopPerformingCompanies(
            @RequestParam(defaultValue = "5") int limit) {

        // Get all bids
        List<Bid> allBids = bidRepository.findAll();

        // Group bids by company
        Map<String, List<Bid>> bidsByCompany = allBids.stream()
                .collect(Collectors.groupingBy(Bid::getCompanyId));

        // Calculate performance metrics for each company
        List<Map<String, Object>> companyMetrics = new ArrayList<>();

        for (Map.Entry<String, List<Bid>> entry : bidsByCompany.entrySet()) {
            String companyId = entry.getKey();
            List<Bid> companyBids = entry.getValue();

            // Skip if no company name (shouldn't happen in real data)
            if (companyBids.isEmpty() || companyBids.get(0).getCompanyName() == null) {
                continue;
            }

            String companyName = companyBids.get(0).getCompanyName();

            // Calculate success rate
            long acceptedBids = companyBids.stream()
                    .filter(bid -> "accepted".equals(bid.getStatus()))
                    .count();
            double successRate = companyBids.isEmpty() ? 0 : (double) acceptedBids / companyBids.size() * 100;

            // Calculate total bid value
            double totalBidValue = companyBids.stream()
                    .mapToDouble(Bid::getAmount)
                    .sum();

            Map<String, Object> metrics = new HashMap<>();
            metrics.put("companyId", companyId);
            metrics.put("companyName", companyName);
            metrics.put("totalBids", companyBids.size());
            metrics.put("acceptedBids", acceptedBids);
            metrics.put("successRate", successRate);
            metrics.put("totalBidValue", totalBidValue);

            companyMetrics.add(metrics);
        }

        // Sort by success rate (highest first)
        companyMetrics.sort((c1, c2) -> {
            Double rate1 = (Double) c1.get("successRate");
            Double rate2 = (Double) c2.get("successRate");
            return rate2.compareTo(rate1);
        });

        // Take only the requested number of companies
        List<Map<String, Object>> topCompanies = companyMetrics.stream()
                .limit(limit)
                .collect(Collectors.toList());

        return ResponseEntity.ok(topCompanies);
    }

    @GetMapping("/company/{companyId}/upcoming-deadlines")
    public ResponseEntity<List<Map<String, Object>>> getCompanyUpcomingDeadlines(
            @PathVariable String companyId,
            @RequestParam(defaultValue = "5") int limit) {

        // Get all bids for the company
        List<Bid> companyBids = bidRepository.findByCompanyId(companyId);

        // Get current date
        LocalDateTime now = LocalDateTime.now();

        // Transform bids to deadline information
        List<Map<String, Object>> deadlines = new ArrayList<>();

        for (Bid bid : companyBids) {
            // Only include active bids
            if ("accepted".equals(bid.getStatus())) {
                // Get tender details
                Optional<Tender> tender = tenderRepository.findById(bid.getTenderId());
                if (tender.isPresent()) {
                    Tender tenderData = tender.get();

                    // Parse the proposed deadline
                    LocalDateTime deadline = LocalDateTime.parse(bid.getProposedDeadline(), DateTimeFormatter.ISO_DATE_TIME);

                    // Only include future deadlines
                    if (deadline.isAfter(now)) {
                        Map<String, Object> deadlineInfo = new HashMap<>();
                        deadlineInfo.put("id", bid.getId());
                        deadlineInfo.put("project", tenderData.getTitle());
                        deadlineInfo.put("deadline", bid.getProposedDeadline());

                        // Calculate days left
                        long daysLeft = java.time.Duration.between(now, deadline).toDays();
                        deadlineInfo.put("daysLeft", daysLeft);

                        // Calculate completion percentage (simplified)
                        LocalDateTime startDate = LocalDateTime.parse(tenderData.getCreatedAt(), DateTimeFormatter.ISO_DATE_TIME);
                        long totalDays = java.time.Duration.between(startDate, deadline).toDays();
                        long elapsedDays = java.time.Duration.between(startDate, now).toDays();
                        int completion = (int) ((elapsedDays * 100) / totalDays);
                        deadlineInfo.put("completion", Math.min(100, Math.max(0, completion)));

                        deadlines.add(deadlineInfo);
                    }
                }
            }
        }

        // Sort by deadline (closest first)
        deadlines.sort((a, b) -> {
            LocalDateTime deadlineA = LocalDateTime.parse((String) a.get("deadline"), DateTimeFormatter.ISO_DATE_TIME);
            LocalDateTime deadlineB = LocalDateTime.parse((String) b.get("deadline"), DateTimeFormatter.ISO_DATE_TIME);
            return deadlineA.compareTo(deadlineB);
        });

        // Limit the number of results
        List<Map<String, Object>> limitedDeadlines = deadlines.stream()
                .limit(limit)
                .collect(Collectors.toList());

        return ResponseEntity.ok(limitedDeadlines);
    }

    /**
     * Get recent activity for company dashboard
     * @param companyId ID of the company
     * @param limit Number of recent activities to return
     * @return List of recent activities
     */
    @GetMapping("/company/{companyId}/recent-activity")
    public ResponseEntity<List<Map<String, Object>>> getCompanyRecentActivity(
            @PathVariable String companyId,
            @RequestParam(defaultValue = "5") int limit) {

        // Get all bids for the company
        List<Bid> companyBids = bidRepository.findByCompanyId(companyId);

        // Sort by creation date (newest first)
        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
        companyBids.sort((b1, b2) -> {
            LocalDateTime date1 = LocalDateTime.parse(b1.getCreatedAt(), formatter);
            LocalDateTime date2 = LocalDateTime.parse(b2.getCreatedAt(), formatter);
            return date2.compareTo(date1);
        });

        // Take only the requested number of bids
        List<Bid> recentBids = companyBids.stream()
                .limit(limit)
                .collect(Collectors.toList());

        // Transform to response format
        List<Map<String, Object>> result = new ArrayList<>();
        for (Bid bid : recentBids) {
            Map<String, Object> activityData = new HashMap<>();
            activityData.put("id", bid.getId());
            activityData.put("type", "bid");
            activityData.put("status", bid.getStatus());
            activityData.put("amount", bid.getAmount());
            activityData.put("createdAt", bid.getCreatedAt());

            // Get tender details
            Tender tender = tenderRepository.findById(bid.getTenderId()).orElse(null);
            if (tender != null) {
                activityData.put("tenderTitle", tender.getTitle());
                activityData.put("clientId", tender.getClientId());
            }

            result.add(activityData);
        }

        return ResponseEntity.ok(result);
    }
}
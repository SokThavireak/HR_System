package com.hrms.controller;

import com.hrms.entity.PerformanceReview;
import com.hrms.entity.User;
import com.hrms.repository.PerformanceReviewRepository;
import com.hrms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin/performance")
@RequiredArgsConstructor
public class AdminPerformanceController {

    private final PerformanceReviewRepository repo;
    private final UserRepository userRepo;

    @GetMapping
    public Page<PerformanceReview> getReviews(@RequestParam(defaultValue = "0") int page) {
        return repo.findAllByOrderByCreatedAtDesc(PageRequest.of(page, 20));
    }

    @PostMapping
    public PerformanceReview create(@AuthenticationPrincipal UserDetails ud,
                                     @RequestBody PerformanceRequest req) {
        User reviewer = userRepo.findByEmail(ud.getUsername()).orElseThrow();
        User employee = userRepo.findById(req.getEmployeeId()).orElseThrow();
        int count = 0; double sum = 0;
        if (req.getQualityScore() != null) { sum += req.getQualityScore(); count++; }
        if (req.getProductivityScore() != null) { sum += req.getProductivityScore(); count++; }
        if (req.getCommunicationScore() != null) { sum += req.getCommunicationScore(); count++; }
        if (req.getTeamworkScore() != null) { sum += req.getTeamworkScore(); count++; }
        if (req.getPunctualityScore() != null) { sum += req.getPunctualityScore(); count++; }
        Double overall = count > 0 ? Math.round((sum / count) * 100.0) / 100.0 : null;

        PerformanceReview r = PerformanceReview.builder()
            .employee(employee).reviewer(reviewer)
            .reviewPeriodStart(req.getReviewPeriodStart()).reviewPeriodEnd(req.getReviewPeriodEnd())
            .qualityScore(req.getQualityScore()).productivityScore(req.getProductivityScore())
            .communicationScore(req.getCommunicationScore()).teamworkScore(req.getTeamworkScore())
            .punctualityScore(req.getPunctualityScore()).overallScore(overall)
            .feedback(req.getFeedback()).goals(req.getGoals()).improvements(req.getImprovements())
            .build();
        return repo.save(r);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { repo.deleteById(id); }

    @lombok.Data
    public static class PerformanceRequest {
        private Long employeeId;
        private java.time.LocalDate reviewPeriodStart;
        private java.time.LocalDate reviewPeriodEnd;
        private Integer qualityScore;
        private Integer productivityScore;
        private Integer communicationScore;
        private Integer teamworkScore;
        private Integer punctualityScore;
        private String feedback;
        private String goals;
        private String improvements;
    }
}

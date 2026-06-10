package com.hrms.controller;

import com.hrms.entity.ActivityLog;
import com.hrms.service.ActivityLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/activity")
public class ActivityLogController {

    @Autowired
    private ActivityLogService activityLogService;

    @GetMapping("/recent")
    public ResponseEntity<List<ActivityLog>> getRecentActivity() {
        return ResponseEntity.ok(activityLogService.getRecentLogs());
    }

    @GetMapping("/all")
    public ResponseEntity<Page<ActivityLog>> getAllActivity(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        return ResponseEntity.ok(activityLogService.getAllLogs(PageRequest.of(page, size)));
    }
}

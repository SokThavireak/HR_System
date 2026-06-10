package com.hrms.service;

import com.hrms.entity.ActivityLog;
import com.hrms.repository.ActivityLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ActivityLogService {

    @Autowired
    private ActivityLogRepository activityLogRepository;

    public void log(String message, String type) {
        ActivityLog log = new ActivityLog(message, type, LocalDateTime.now());
        activityLogRepository.save(log);
    }

    public List<ActivityLog> getRecentLogs() {
        return activityLogRepository.findTop10ByOrderByTimestampDesc();
    }

    public Page<ActivityLog> getAllLogs(Pageable pageable) {
        return activityLogRepository.findAllByOrderByTimestampDesc(pageable);
    }
}

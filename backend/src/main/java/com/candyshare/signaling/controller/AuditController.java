package com.candyshare.signaling.controller;

import com.candyshare.signaling.model.TransferAudit;
import com.candyshare.signaling.repository.TransferAuditRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/audit")
@CrossOrigin(origins = "*")
public class AuditController {

    @Autowired
    private TransferAuditRepository auditRepository;

    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("OK");
    }

    @PostMapping("/log")
    public ResponseEntity<String> logTransfer(@RequestBody Map<String, Object> payload) {
        String roomId = (String) payload.get("roomId");
        String fileCategory = (String) payload.get("fileCategory");
        String sizeBucket = (String) payload.get("sizeBucket");
        String status = (String) payload.get("status");

        TransferAudit audit = new TransferAudit(roomId, fileCategory, sizeBucket, status);
        auditRepository.save(audit);

        return ResponseEntity.ok("Anonymized audit event recorded successfully.");
    }

    @GetMapping("/logs")
    public List<TransferAudit> getAllLogs() {
        return auditRepository.findAll();
    }
}
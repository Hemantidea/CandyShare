package com.candyshare.signaling.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "p2p_transfer_audits")
public class TransferAudit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String roomId;
    private String fileCategory; // e.g. DOCUMENT, IMAGE, VIDEO, ARCHIVE, OTHER
    private String sizeBucket;   // e.g. < 1MB, 1MB - 100MB
    private String status;
    private LocalDateTime timestamp;

    public TransferAudit() {}

    public TransferAudit(String roomId, String fileCategory, String sizeBucket, String status) {
        this.roomId = roomId;
        this.fileCategory = fileCategory;
        this.sizeBucket = sizeBucket;
        this.status = status;
        this.timestamp = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getRoomId() { return roomId; }
    public String getFileCategory() { return fileCategory; }
    public String getSizeBucket() { return sizeBucket; }
    public String getStatus() { return status; }
    public LocalDateTime getTimestamp() { return timestamp; }
}
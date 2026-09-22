package com.candyshare.signaling.repository;

import com.candyshare.signaling.model.TransferAudit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransferAuditRepository extends JpaRepository<TransferAudit, Long> {
}
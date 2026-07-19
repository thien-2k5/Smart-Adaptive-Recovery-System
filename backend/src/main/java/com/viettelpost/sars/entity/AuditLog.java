package com.viettelpost.sars.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import com.viettelpost.sars.enums.*;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private String entityType; private Long entityId; private String action; private String performedBy;
    private String oldValue; private String newValue; private String ipAddress; private Instant createdAt;
    
}

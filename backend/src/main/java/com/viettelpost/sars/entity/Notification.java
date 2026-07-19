package com.viettelpost.sars.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import com.viettelpost.sars.enums.*;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name = "customer_id") private Customer customer;
    @ManyToOne @JoinColumn(name = "recovery_case_id") private RecoveryCase recoveryCase;
    private String title; private String message;
    @Enumerated(EnumType.STRING) private NotificationType notificationType;
    private Boolean isRead; private Instant createdAt;
    
}

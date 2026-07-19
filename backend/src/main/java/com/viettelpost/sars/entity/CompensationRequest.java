package com.viettelpost.sars.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import com.viettelpost.sars.enums.*;

@Entity
@Table(name = "compensation_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompensationRequest {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name = "recovery_case_id") private RecoveryCase recoveryCase;
    @ManyToOne @JoinColumn(name = "customer_id") private Customer customer;
    @Enumerated(EnumType.STRING) private CompensationType compensationType;
    private java.math.BigDecimal compensationAmount; private String currency;
    @Enumerated(EnumType.STRING) private CompensationStatus status;
    private String reason; private Instant createdAt; private Instant processedAt;
    
}

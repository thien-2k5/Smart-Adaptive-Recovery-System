package com.viettelpost.sars.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import com.viettelpost.sars.enums.*;

@Entity
@Table(name = "recovery_cases")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecoveryCase {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private String caseId;
    @ManyToOne @JoinColumn(name = "shipment_id") private Shipment shipment;
    @ManyToOne @JoinColumn(name = "customer_id") private Customer customer;
    @Enumerated(EnumType.STRING) private CustomerType customerType;
    @Enumerated(EnumType.STRING) private ParcelCategory parcelCategory;
    @Enumerated(EnumType.STRING) private InsuranceStatus insuranceStatus;
    @Enumerated(EnumType.STRING) private RecoveryMode recoveryMode;
    @Enumerated(EnumType.STRING) private InvestigationStatus investigationStatus;
    @Enumerated(EnumType.STRING) private ResolutionType resolutionType;
    private String selectedOption; private Instant nextUpdateAt; private Integer estimatedResolutionHours;
    private String investigationNotes; private Instant createdAt; private Instant updatedAt; private Instant closedAt;
    
}

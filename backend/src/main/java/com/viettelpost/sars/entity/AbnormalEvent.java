package com.viettelpost.sars.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import com.viettelpost.sars.enums.*;

@Entity
@Table(name = "abnormal_events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AbnormalEvent {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name = "shipment_id") private Shipment shipment;
    @Enumerated(EnumType.STRING) private AbnormalEventType eventType;
    @Enumerated(EnumType.STRING) private ShipmentStatus detectedAtStatus;
    private String description; private Integer delayMinutes; private Boolean autoResolved;
    private Instant detectedAt; private Instant resolvedAt;
    
}

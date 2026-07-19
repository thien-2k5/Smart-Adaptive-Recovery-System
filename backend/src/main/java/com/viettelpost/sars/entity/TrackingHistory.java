package com.viettelpost.sars.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import com.viettelpost.sars.enums.*;

@Entity
@Table(name = "tracking_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrackingHistory {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name = "shipment_id") private Shipment shipment;
    @Enumerated(EnumType.STRING) private ShipmentStatus status;
    private String location; private String description; private Boolean isCurrent;
    private Instant occurredAt; private Instant createdAt;
    
}

package com.viettelpost.sars.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import com.viettelpost.sars.enums.*;

@Entity
@Table(name = "shipments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Shipment {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private String trackingId;
    @ManyToOne @JoinColumn(name = "customer_id") private Customer customer;
    private String senderName; private String senderPhone; private String receiverName; private String receiverPhone;
    @Enumerated(EnumType.STRING) private CustomerType customerType;
    @Enumerated(EnumType.STRING) private ParcelCategory parcelCategory;
    @Enumerated(EnumType.STRING) private InsuranceStatus insuranceStatus;
    @Enumerated(EnumType.STRING) private ShipmentStatus currentStatus;
    @Enumerated(EnumType.STRING) private RecoveryMode recoveryMode;
    private java.math.BigDecimal declaredValue; private java.math.BigDecimal shippingFee;
    private Instant estimatedDelivery; private Integer delayStageIndex;
    private Boolean isDemo; private Boolean simulationActive;
    private Instant createdAt; private Instant updatedAt;
    
}

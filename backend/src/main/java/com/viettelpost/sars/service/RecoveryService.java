package com.viettelpost.sars.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.viettelpost.sars.repository.*;
import com.viettelpost.sars.entity.*;
import com.viettelpost.sars.enums.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class RecoveryService {

    private final RecoveryCaseRepository recoveryCaseRepository;
    private final ShipmentRepository shipmentRepository;
    private final NotificationService notificationService;
    private final AbnormalEventRepository abnormalEventRepository;

    @Transactional
    public void handleAbnormalDelay(Long shipmentId) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new RuntimeException("Shipment not found"));

        // 1. Determine Recovery Mode
        RecoveryMode mode = determineRecoveryMode(shipment.getParcelCategory(), shipment.getCustomerType());
        shipment.setRecoveryMode(mode);
        shipmentRepository.save(shipment);

        // 2. Create Abnormal Event record
        AbnormalEvent event = AbnormalEvent.builder()
                .shipment(shipment)
                .eventType(AbnormalEventType.ABNORMAL_DELAY)
                .detectedAtStatus(ShipmentStatus.AT_SORTING_HUB)
                .description("Parcel remained at sorting hub longer than expected threshold")
                .delayMinutes(1440) // mock
                .autoResolved(false)
                .detectedAt(Instant.now())
                .build();
        abnormalEventRepository.save(event);

        // 3. Create Recovery Case
        RecoveryCase recoveryCase = RecoveryCase.builder()
                .caseId("RC" + System.currentTimeMillis() + shipmentId)
                .shipment(shipment)
                .customer(shipment.getCustomer())
                .customerType(shipment.getCustomerType())
                .parcelCategory(shipment.getParcelCategory())
                .insuranceStatus(shipment.getInsuranceStatus())
                .recoveryMode(mode)
                .investigationStatus(InvestigationStatus.CREATED)
                .estimatedResolutionHours(7)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
        
        recoveryCaseRepository.save(recoveryCase);

        // 4. Send Real-time Notification via SSE
        notificationService.sendDelayAlert(shipment.getCustomer(), recoveryCase);
    }

    private RecoveryMode determineRecoveryMode(ParcelCategory category, CustomerType customerType) {
        if (category == ParcelCategory.COMMERCIAL_GOODS) {
            return RecoveryMode.FAST_REPLACEMENT_REFUND;
        } else if (category == ParcelCategory.IMPORTANT_DOCUMENTS) {
            return RecoveryMode.PRIORITY_RECOVERY;
        } else if (category == ParcelCategory.ONE_OF_A_KIND) {
            return RecoveryMode.INTENSIVE_SEARCH;
        }
        return RecoveryMode.STANDARD_RECOVERY;
    }
}

package com.viettelpost.sars.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.viettelpost.sars.repository.ShipmentRepository;
import com.viettelpost.sars.entity.Shipment;
import com.viettelpost.sars.enums.ShipmentStatus;
import org.springframework.beans.factory.annotation.Value;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SimulationService {
    private final ShipmentRepository shipmentRepository;
    private final RecoveryService recoveryService;

    @Value("${sars.simulation.enabled:true}")
    private boolean simulationEnabled;

    @Value("${sars.simulation.delay-threshold-minutes:1}")
    private int delayThreshold;

    @org.springframework.scheduling.annotation.Scheduled(fixedRateString = "${sars.simulation.interval-ms}")
    @Transactional
    public void runSimulation() {
        if (!simulationEnabled) return;
        
        log.info("Running simulation cycle...");
        List<Shipment> activeShipments = shipmentRepository.findBySimulationActiveTrue();
        
        for (Shipment shipment : activeShipments) {
            processShipment(shipment);
        }
    }
    
    private void processShipment(Shipment shipment) {
        // Simple state machine for simulation
        ShipmentStatus current = shipment.getCurrentStatus();
        
        // If it's randomly selected to be delayed in seed data, it stays in AT_SORTING_HUB
        // For demo purposes, we'll simulate it being stuck and triggering the anomaly.
        
        if (current == ShipmentStatus.AT_SORTING_HUB) {
            // Check if stuck based on time (mock logic for demo: simulate delay immediately)
            if (Math.random() > 0.8) { // 20% chance to become abnormal in simulation tick
                shipment.setCurrentStatus(ShipmentStatus.ABNORMAL_DELAY_DETECTED);
                shipment.setSimulationActive(false); // Stop normal simulation, wait for recovery
                shipmentRepository.save(shipment);
                
                log.warn("Abnormal delay detected for shipment: {}", shipment.getTrackingId());
                recoveryService.handleAbnormalDelay(shipment.getId());
            }
        }
        
        // Normally, a shipment would progress: CREATED -> CONFIRMED -> AT_SORTING_HUB -> OUT_FOR_DELIVERY -> DELIVERED
    }
}

package com.viettelpost.sars.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import com.viettelpost.sars.dto.request.*;
import com.viettelpost.sars.dto.response.*;

@Service
@RequiredArgsConstructor
public class ShipmentService {
    
    public ShipmentDto getShipment(String trackingId) { return null; }
    public ShipmentDto createShipment(CreateShipmentRequest req) { return null; }
    
}

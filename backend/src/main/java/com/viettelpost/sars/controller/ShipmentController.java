package com.viettelpost.sars.controller;

import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import com.viettelpost.sars.dto.response.*;
import com.viettelpost.sars.service.*;

@RestController
@RequestMapping("/api/shipments")
@RequiredArgsConstructor
public class ShipmentController {
    
    @GetMapping("/{trackingId}")
    public ApiResponse<ShipmentDto> getShipment(@PathVariable String trackingId) { return null; }
    
}

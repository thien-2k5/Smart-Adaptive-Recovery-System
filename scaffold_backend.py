import os

base_path = "backend/src/main/java/com/viettelpost/sars"
dirs = ["dto", "dto/request", "dto/response", "service", "controller", "config", "exception"]

for d in dirs:
    os.makedirs(os.path.join(base_path, d), exist_ok=True)

def write_file(sub_path, content):
    with open(os.path.join(base_path, sub_path), "w") as f:
        f.write(content)

# DTOs
write_file("dto/response/ApiResponse.java", """package com.viettelpost.sars.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
}
""")

# DTOs request/response placeholders for important entities
for name in ["Shipment", "Customer", "RecoveryCase", "Notification"]:
    write_file(f"dto/response/{name}Dto.java", f"""package com.viettelpost.sars.dto.response;

import lombok.Data;

@Data
public class {name}Dto {{
    private Long id;
    // Add specific fields if needed
}}
""")

write_file("dto/request/CreateShipmentRequest.java", """package com.viettelpost.sars.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import com.viettelpost.sars.enums.*;

@Data
public class CreateShipmentRequest {
    @NotNull private Long customerId;
    @NotBlank private String senderName;
    @NotBlank private String senderPhone;
    @NotBlank private String receiverName;
    @NotBlank private String receiverPhone;
    @NotNull private ParcelCategory parcelCategory;
    @NotNull private InsuranceStatus insuranceStatus;
    @NotNull private java.math.BigDecimal declaredValue;
}
""")

# EXCEPTIONS
write_file("exception/ResourceNotFoundException.java", """package com.viettelpost.sars.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
""")

write_file("exception/GlobalExceptionHandler.java", """package com.viettelpost.sars.exception;

import com.viettelpost.sars.dto.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ApiResponse<Void> handleNotFound(ResourceNotFoundException ex) {
        return new ApiResponse<>(false, ex.getMessage(), null);
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ApiResponse<Void> handleGeneral(Exception ex) {
        return new ApiResponse<>(false, "An error occurred: " + ex.getMessage(), null);
    }
}
""")

# CONFIG
write_file("config/CorsConfig.java", """package com.viettelpost.sars.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOriginPatterns("*") // allow all for demo
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
""")

write_file("config/SchedulingConfig.java", """package com.viettelpost.sars.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

@Configuration
@EnableScheduling
public class SchedulingConfig {
}
""")

# SERVICES
services = {
    "ShipmentService": """
    public ShipmentDto getShipment(String trackingId) { return null; }
    public ShipmentDto createShipment(CreateShipmentRequest req) { return null; }
    """,
    "SimulationService": """
    @org.springframework.scheduling.annotation.Scheduled(fixedRateString = "${sars.simulation.interval-ms}")
    public void runSimulation() {
        // Find active shipments, advance their tracking, trigger delay logic
    }
    """,
    "RecoveryService": """
    public void handleAbnormalDelay(Long shipmentId) {
        // Create recovery case, determine mode
    }
    """,
    "NotificationService": """
    public void sendNotification(Long customerId, String type, String message) {
        // Push via SSE
    }
    """
}

for name, methods in services.items():
    write_file(f"service/{name}.java", f"""package com.viettelpost.sars.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import com.viettelpost.sars.dto.request.*;
import com.viettelpost.sars.dto.response.*;

@Service
@RequiredArgsConstructor
public class {name} {{
    {methods}
}}
""")

# CONTROLLERS
controllers = {
    "ShipmentController": """
    @GetMapping("/{trackingId}")
    public ApiResponse<ShipmentDto> getShipment(@PathVariable String trackingId) { return null; }
    """,
    "RecoveryController": """
    @GetMapping("/{caseId}")
    public ApiResponse<RecoveryCaseDto> getCase(@PathVariable String caseId) { return null; }
    """,
    "NotificationController": """
    @GetMapping(value = "/stream/{customerId}", produces = org.springframework.http.MediaType.TEXT_EVENT_STREAM_VALUE)
    public org.springframework.web.servlet.mvc.method.annotation.SseEmitter stream(@PathVariable Long customerId) { return null; }
    """
}

for name, methods in controllers.items():
    mapping = name.replace("Controller", "").lower() + "s"
    write_file(f"controller/{name}.java", f"""package com.viettelpost.sars.controller;

import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import com.viettelpost.sars.dto.response.*;
import com.viettelpost.sars.service.*;

@RestController
@RequestMapping("/api/{mapping}")
@RequiredArgsConstructor
public class {name} {{
    {methods}
}}
""")

print("Backend scaffolding complete.")

package com.viettelpost.sars.dto.request;

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

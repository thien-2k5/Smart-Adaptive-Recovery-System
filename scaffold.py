import os

base_path = "backend/src/main/java/com/viettelpost/sars"
dirs = ["enums", "entity", "repository", "dto", "dto/request", "dto/response", "service", "controller", "config", "exception"]

for d in dirs:
    os.makedirs(os.path.join(base_path, d), exist_ok=True)

def write_file(sub_path, content):
    with open(os.path.join(base_path, sub_path), "w") as f:
        f.write(content)

# ENUMS
enums = {
    "Role": "ADMIN, USER",
    "CustomerType": "ONLINE_SHOPPER, ONLINE_MERCHANT, INDIVIDUAL_SENDER",
    "ParcelCategory": "COMMERCIAL_GOODS, PERSONAL_ITEMS, IMPORTANT_DOCUMENTS, ONE_OF_A_KIND, FRAGILE",
    "InsuranceStatus": "INSURED, NOT_INSURED",
    "ShipmentStatus": "CREATED, CONFIRMED, PREPARING, IN_TRANSIT_TO_HUB, AT_SORTING_HUB, OUT_FOR_DELIVERY, DELIVERED, ABNORMAL_DELAY_DETECTED",
    "RecoveryMode": "FAST_REPLACEMENT_REFUND, STANDARD_RECOVERY, PRIORITY_RECOVERY, INTENSIVE_SEARCH",
    "InvestigationStatus": "CREATED, IN_PROGRESS, PARCEL_FOUND, CONFIRMED_LOST, CLOSED",
    "ResolutionType": "PARCEL_FOUND, CONFIRMED_LOST",
    "NotificationType": "DELAY_DETECTED, INVESTIGATION_UPDATE, RESOLUTION_FOUND, COMPENSATION_PROCESSED, GENERAL",
    "ActionType": "SELECT_CONTINUE, SELECT_REFUND, SELECT_REPLACEMENT, CONFIRM_CLOSE",
    "CompensationType": "FULL_VALUE, SHIPPING_FEE_4X, VOUCHER, LOYALTY_POINTS",
    "CompensationStatus": "PENDING, APPROVED, PROCESSED",
    "AbnormalEventType": "ABNORMAL_DELAY, LOST, DAMAGED"
}

for name, values in enums.items():
    write_file(f"enums/{name}.java", f"""package com.viettelpost.sars.enums;

public enum {name} {{
    {values.replace(' ', '').replace(',', ',\n    ')}
}}
""")

# ENTITIES
entities = {
    "User": """
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private String username; private String passwordHash; private String email; private String fullName;
    @Enumerated(EnumType.STRING) private Role role;
    private Boolean isActive; private Instant createdAt; private Instant updatedAt;
    """,
    "Customer": """
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @OneToOne @JoinColumn(name = "user_id") private User user;
    private String fullName; private String phone; private String email;
    @Enumerated(EnumType.STRING) private CustomerType customerType;
    private String preferredLanguage; private Instant createdAt; private Instant updatedAt;
    """,
    "Shipment": """
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
    """,
    "TrackingHistory": """
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name = "shipment_id") private Shipment shipment;
    @Enumerated(EnumType.STRING) private ShipmentStatus status;
    private String location; private String description; private Boolean isCurrent;
    private Instant occurredAt; private Instant createdAt;
    """,
    "AbnormalEvent": """
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name = "shipment_id") private Shipment shipment;
    @Enumerated(EnumType.STRING) private AbnormalEventType eventType;
    @Enumerated(EnumType.STRING) private ShipmentStatus detectedAtStatus;
    private String description; private Integer delayMinutes; private Boolean autoResolved;
    private Instant detectedAt; private Instant resolvedAt;
    """,
    "RecoveryCase": """
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
    """,
    "Notification": """
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name = "customer_id") private Customer customer;
    @ManyToOne @JoinColumn(name = "recovery_case_id") private RecoveryCase recoveryCase;
    private String title; private String message;
    @Enumerated(EnumType.STRING) private NotificationType notificationType;
    private Boolean isRead; private Instant createdAt;
    """,
    "CustomerAction": """
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name = "recovery_case_id") private RecoveryCase recoveryCase;
    @ManyToOne @JoinColumn(name = "customer_id") private Customer customer;
    @Enumerated(EnumType.STRING) private ActionType actionType;
    private String actionDetails; private Instant createdAt;
    """,
    "CompensationRequest": """
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name = "recovery_case_id") private RecoveryCase recoveryCase;
    @ManyToOne @JoinColumn(name = "customer_id") private Customer customer;
    @Enumerated(EnumType.STRING) private CompensationType compensationType;
    private java.math.BigDecimal compensationAmount; private String currency;
    @Enumerated(EnumType.STRING) private CompensationStatus status;
    private String reason; private Instant createdAt; private Instant processedAt;
    """,
    "HelpCenterArticle": """
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private String slug; private String category; private String titleVi; private String contentVi;
    private String titleEn; private String contentEn; private Integer sortOrder;
    private Boolean isPublished; private Instant createdAt; private Instant updatedAt;
    """,
    "AuditLog": """
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private String entityType; private Long entityId; private String action; private String performedBy;
    private String oldValue; private String newValue; private String ipAddress; private Instant createdAt;
    """
}

table_names = {
    "User": "users", "Customer": "customers", "Shipment": "shipments",
    "TrackingHistory": "tracking_history", "AbnormalEvent": "abnormal_events",
    "RecoveryCase": "recovery_cases", "Notification": "notifications",
    "CustomerAction": "customer_actions", "CompensationRequest": "compensation_requests",
    "HelpCenterArticle": "help_center_articles", "AuditLog": "audit_logs"
}

for name, fields in entities.items():
    table_name = table_names.get(name, name.lower() + "s")
    write_file(f"entity/{name}.java", f"""package com.viettelpost.sars.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import com.viettelpost.sars.enums.*;

@Entity
@Table(name = "{table_name}")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class {name} {{
{fields}
}}
""")

# REPOSITORIES
for name in entities.keys():
    write_file(f"repository/{name}Repository.java", f"""package com.viettelpost.sars.repository;

import com.viettelpost.sars.entity.{name};
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface {name}Repository extends JpaRepository<{name}, Long> {{
}}
""")

print("Scaffolding complete.")

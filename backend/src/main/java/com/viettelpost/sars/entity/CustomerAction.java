package com.viettelpost.sars.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import com.viettelpost.sars.enums.*;

@Entity
@Table(name = "customer_actions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerAction {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne @JoinColumn(name = "recovery_case_id") private RecoveryCase recoveryCase;
    @ManyToOne @JoinColumn(name = "customer_id") private Customer customer;
    @Enumerated(EnumType.STRING) private ActionType actionType;
    private String actionDetails; private Instant createdAt;
    
}

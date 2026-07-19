package com.viettelpost.sars.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import com.viettelpost.sars.enums.*;

@Entity
@Table(name = "customers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @OneToOne @JoinColumn(name = "user_id") private User user;
    private String fullName; private String phone; private String email;
    @Enumerated(EnumType.STRING) private CustomerType customerType;
    private String preferredLanguage; private Instant createdAt; private Instant updatedAt;
    
}

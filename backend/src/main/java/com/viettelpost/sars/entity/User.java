package com.viettelpost.sars.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import com.viettelpost.sars.enums.*;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private String username; private String passwordHash; private String email; private String fullName;
    @Enumerated(EnumType.STRING) private Role role;
    private Boolean isActive; private Instant createdAt; private Instant updatedAt;
    
}

package com.viettelpost.sars.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import com.viettelpost.sars.enums.*;

@Entity
@Table(name = "help_center_articles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HelpCenterArticle {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private String slug; private String category; private String titleVi; private String contentVi;
    private String titleEn; private String contentEn; private Integer sortOrder;
    private Boolean isPublished; private Instant createdAt; private Instant updatedAt;
    
}

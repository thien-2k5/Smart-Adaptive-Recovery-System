package com.viettelpost.sars.repository;

import com.viettelpost.sars.entity.HelpCenterArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HelpCenterArticleRepository extends JpaRepository<HelpCenterArticle, Long> {
}

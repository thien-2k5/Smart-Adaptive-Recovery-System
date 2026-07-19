package com.viettelpost.sars.repository;

import com.viettelpost.sars.entity.AbnormalEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AbnormalEventRepository extends JpaRepository<AbnormalEvent, Long> {
}

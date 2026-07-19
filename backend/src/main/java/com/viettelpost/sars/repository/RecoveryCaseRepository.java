package com.viettelpost.sars.repository;

import com.viettelpost.sars.entity.RecoveryCase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecoveryCaseRepository extends JpaRepository<RecoveryCase, Long> {
}

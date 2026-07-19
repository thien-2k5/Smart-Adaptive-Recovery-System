package com.viettelpost.sars.repository;

import com.viettelpost.sars.entity.CompensationRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompensationRequestRepository extends JpaRepository<CompensationRequest, Long> {
}

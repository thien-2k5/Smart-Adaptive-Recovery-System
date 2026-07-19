package com.viettelpost.sars.repository;

import com.viettelpost.sars.entity.CustomerAction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerActionRepository extends JpaRepository<CustomerAction, Long> {
}

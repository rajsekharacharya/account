package com.app.account.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.app.account.model.BalanceSheet;

@Repository
public interface BalanceSheetRepository extends JpaRepository<BalanceSheet, Integer> {
}

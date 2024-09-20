package com.app.account.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.app.account.model.InPersonBalanceSheet;

@Repository
public interface InPersonBalanceSheetRepository extends JpaRepository<InPersonBalanceSheet, Integer> {
}

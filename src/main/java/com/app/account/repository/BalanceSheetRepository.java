package com.app.account.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.app.account.model.BalanceSheet;

@Repository
public interface BalanceSheetRepository extends JpaRepository<BalanceSheet, Integer> {

    Optional<BalanceSheet> findByDate(String date);

    @Query(value = "SELECT * FROM balance_sheet ORDER BY date DESC LIMIT 1", nativeQuery = true)
    Optional<BalanceSheet> findLatestBalanceSheet();
}
package com.app.account.repository;

import java.util.List;
import java.util.Map;
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

    @Query(value = "SELECT * FROM balance_sheet WHERE date > ?1", nativeQuery = true)
    List<BalanceSheet> getAfterDate(String date);

    @Query(value = "SELECT YEAR(STR_TO_DATE(`date`, '%Y-%m-%d')) AS year,MONTH(STR_TO_DATE(`date`, '%Y-%m-%d')) AS month,SUM(closing) - SUM(opening) AS profit FROM balance_sheet WHERE YEAR(STR_TO_DATE(`date`, '%Y-%m-%d')) = YEAR(CURRENT_DATE()) GROUP BY year, month ORDER BY year, month;", nativeQuery = true)
    List<Map<String,Object>> getForDashboard();
}
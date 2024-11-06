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

    List<BalanceSheet> findByDateBetween(String startDate,String endDate);

    @Query(value = "SELECT * FROM balance_sheet ORDER BY date DESC LIMIT 1", nativeQuery = true)
    Optional<BalanceSheet> findLatestBalanceSheet();

    @Query(value = "SELECT * FROM balance_sheet WHERE date > ?1", nativeQuery = true)
    List<BalanceSheet> getAfterDate(String date);
    
    @Query(value = "SELECT * FROM balance_sheet WHERE YEAR(STR_TO_DATE(`date`, '%Y-%m-%d')) = YEAR(CURRENT_DATE()) AND MONTH(STR_TO_DATE(`date`, '%Y-%m-%d')) = MONTH(CURRENT_DATE()) ORDER BY date DESC", nativeQuery = true)
    List<BalanceSheet> getMonthly();

    @Query(value = "SELECT YEAR(STR_TO_DATE(`date`, '%Y-%m-%d')) AS year,MONTH(STR_TO_DATE(`date`, '%Y-%m-%d')) AS month,SUM(closing) - SUM(opening) AS profit FROM balance_sheet WHERE YEAR(STR_TO_DATE(`date`, '%Y-%m-%d')) = YEAR(CURRENT_DATE()) GROUP BY year, month ORDER BY year, month;", nativeQuery = true)
    List<Map<String,Object>> getForDashboard();

    @Query(value = "SELECT sum(in_amount) as InMoneyYear,sum(out_amount) as OutMoneyYear FROM account.transaction WHERE YEAR(STR_TO_DATE(`date`, '%Y-%m-%d')) = YEAR(CURRENT_DATE())", nativeQuery = true)
    List<Map<String,Object>> getINOUTMoneyPresentYear();
    @Query(value = "SELECT sum(in_amount) as InMoneyMonth,sum(out_amount) as OutMoneyMonth FROM account.transaction WHERE YEAR(STR_TO_DATE(`date`, '%Y-%m-%d')) = YEAR(CURRENT_DATE()) AND MONTH(STR_TO_DATE(`date`, '%Y-%m-%d')) = MONTH(CURRENT_DATE())", nativeQuery = true)
    List<Map<String,Object>> getINOUTMoneyPresentMonth();
}
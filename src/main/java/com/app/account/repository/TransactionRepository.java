package com.app.account.repository;

import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.app.account.model.Transaction;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Integer> {

    List<Transaction> findByDate(String date);

    List<Transaction> findByDateBetween(String startDate, String endDate);

    List<Transaction> findByParticularIdAndDateBetween(Integer particularId,String startDate, String endDate);

    @Query(value = "SELECT ifnull(sum(in_amount),0) as inAmount,ifnull(sum(out_amount),0) as outAmount FROM account.transaction where date < ?1", nativeQuery = true)
    Map<String,Double> getTransactionSumByParticular(String date);

}

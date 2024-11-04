package com.app.account.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.app.account.model.Transaction;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Integer>{
    
}

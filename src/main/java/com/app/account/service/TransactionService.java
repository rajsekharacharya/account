package com.app.account.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.app.account.model.Transaction;
import com.app.account.repository.TransactionRepository;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    // Get all transactions
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    // Get transaction by ID
    public Optional<Transaction> getTransactionById(Integer id) {
        return transactionRepository.findById(id);
    }

    // Create a new transaction
    public Transaction createTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    // Update an existing transaction
    public Transaction updateTransaction(Transaction transactionDetails) throws Exception {
        return transactionRepository.findById(transactionDetails.getId())
                .map(transaction -> {
                    transaction.setDate(transactionDetails.getDate());
                    transaction.setParticularId(transactionDetails.getParticularId());
                    transaction.setParticularName(transactionDetails.getParticularName());
                    transaction.setTransactionType(transactionDetails.getTransactionType());
                    transaction.setAmount(transactionDetails.getAmount());
                    transaction.setActive(transactionDetails.isActive());
                    return transactionRepository.save(transaction);
                })
                .orElseThrow(() -> new Exception("Transaction not found with id " + transactionDetails.getId()));
    }

    // Delete a transaction
    public void deleteTransaction(Integer id) {
        transactionRepository.deleteById(id);
    }
}

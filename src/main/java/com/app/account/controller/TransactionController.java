package com.app.account.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.app.account.model.Transaction;
import com.app.account.service.TransactionService;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    // Get all transactions
    @GetMapping
    public List<Transaction> getAllTransactions() {
        return transactionService.getAllTransactions();
    }

    // Get transaction by ID
    @GetMapping(value = "/byId")
    public ResponseEntity<Transaction> getTransactionById(@RequestParam Integer id) {
        return transactionService.getTransactionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create a new transaction
    @PostMapping(consumes = "application/json")
    public ResponseEntity<?> createTransaction(@RequestBody List<Transaction> transaction) {
        return transactionService.createTransaction(transaction);
    }
    @PostMapping(value = "/postEntry",consumes = "application/json")
    public ResponseEntity<?> postEntry(@RequestBody Transaction transaction)  throws Exception {
        return transactionService.postEntry(transaction);
    }

    // Update an existing transaction
    @PutMapping
    public ResponseEntity<?> updateTransaction(@RequestBody Transaction transactionDetails) throws Exception {
        return transactionService.updateTransaction(transactionDetails);
    }

    // Delete a transaction
    @DeleteMapping
    public ResponseEntity<?> deleteTransaction(@RequestParam Integer id) {
        return transactionService.deleteTransaction(id);
    }
}

package com.app.account.service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.app.account.model.BalanceSheet;
import com.app.account.model.Transaction;
import com.app.account.repository.BalanceSheetRepository;
import com.app.account.repository.TransactionRepository;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private BalanceSheetRepository balanceSheetRepository;

    // Get all transactions
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findByDate(LocalDate.now().toString());
    }

    // Get transaction by ID
    public Optional<Transaction> getTransactionById(Integer id) {
        return transactionRepository.findById(id);
    }

    // Create a new transaction
    public ResponseEntity<?> createTransaction(List<Transaction> transaction) {
        Optional<BalanceSheet> byDate = balanceSheetRepository.findByDate(LocalDate.now().toString());

        if (!byDate.isPresent()) {
            Optional<BalanceSheet> latestBalanceSheet = balanceSheetRepository.findLatestBalanceSheet();
            if (latestBalanceSheet.isPresent()) {
                if (latestBalanceSheet.get().getClosing() == null) {
                    return new ResponseEntity<>(
                            "Please Close " + latestBalanceSheet.get().getDate() + " closing balance",
                            HttpStatus.BAD_REQUEST);
                }
                BalanceSheet balanceSheet = new BalanceSheet();
                balanceSheet.setDate(LocalDate.now().toString());
                balanceSheet.setOpening(latestBalanceSheet.get().getClosing());
                balanceSheetRepository.save(balanceSheet);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Please Update Balance Data");
            }
        }

        transaction.forEach(x -> {
            x.setDate(LocalDate.now().toString());
            x.setActive(true);
            transactionRepository.save(x);
        });
        return ResponseEntity.status(HttpStatus.OK).body("Saved");
    }

    public ResponseEntity<?> postEntry(Transaction transactionDetails) {
        Optional<BalanceSheet> balanceSheetOptional = balanceSheetRepository.findByDate(transactionDetails.getDate());

        if (balanceSheetOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Not Found");
        }

        BalanceSheet balanceSheet = balanceSheetOptional.get();
        transactionDetails.setActive(true);
        Transaction savedTransaction = transactionRepository.save(transactionDetails);

        if (balanceSheet.getClosing() == null) {
            return ResponseEntity.status(HttpStatus.OK).body("Updated");
        }

        double amountChange = savedTransaction.getInAmount() - savedTransaction.getOutAmount();
        updateBalanceSheet(balanceSheet, amountChange);

        return ResponseEntity.status(HttpStatus.OK).body("Updated");
    }

    private void updateBalanceSheet(BalanceSheet balanceSheet, double amountChange) {
        balanceSheet.setClosing(balanceSheet.getClosing() + amountChange);
        BalanceSheet updatedBalanceSheet = balanceSheetRepository.save(balanceSheet);

        List<BalanceSheet> afterDateSheets = balanceSheetRepository.getAfterDate(updatedBalanceSheet.getDate());
        afterDateSheets.forEach(sheet -> {
            sheet.setOpening(sheet.getOpening() + amountChange);
            sheet.setClosing(sheet.getClosing() + amountChange);
            balanceSheetRepository.save(sheet);
        });
    }

    // Update an existing transaction
    public ResponseEntity<?> updateTransaction(Transaction transactionDetails) throws Exception {
        return transactionRepository.findById(transactionDetails.getId())
                .map(transaction -> {
                    transaction.setDate(transactionDetails.getDate());
                    transaction.setParticularId(transactionDetails.getParticularId());
                    transaction.setParticularName(transactionDetails.getParticularName());
                    transaction.setQty(transactionDetails.getQty());
                    transaction.setInAmount(transactionDetails.getInAmount());
                    transaction.setOutAmount(transactionDetails.getOutAmount());
                    transaction.setActive(transactionDetails.isActive());
                    transactionRepository.save(transaction);
                    return ResponseEntity.status(HttpStatus.OK).body("Updated");
                })
                .orElseThrow(() -> new Exception("Transaction not found with id " + transactionDetails.getId()));
    }

    // Delete a transaction
    public ResponseEntity<?> deleteTransaction(Integer id) {
        Optional<Transaction> byId = transactionRepository.findById(id);
        Map<Boolean, String> messages = new HashMap<>();
        messages.put(true, "Deactivate");
        messages.put(false, "Activate");

        String message = byId.map(particular -> {
            particular.setActive(!particular.isActive());
            transactionRepository.save(particular);
            return messages.get(particular.isActive());
        }).orElse("Not Found");

        return ResponseEntity.status(message.equals("Not Found") ? HttpStatus.BAD_REQUEST : HttpStatus.OK)
                .body(message);
    }

}

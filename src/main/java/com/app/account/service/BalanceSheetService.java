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
public class BalanceSheetService {

    @Autowired
    private BalanceSheetRepository balanceSheetRepository;
    @Autowired
    private TransactionRepository transactionRepository;

    // Get all balance sheets
    public List<BalanceSheet> getAllBalanceSheets() {
        return balanceSheetRepository.findAll();
    }

    // Get balance sheet by ID
    public Optional<BalanceSheet> getBalanceSheetById(Integer id) {
        return balanceSheetRepository.findById(id);
    }

    public ResponseEntity<?> getDataForDashBoard() {
        Map<String,Object> data = new HashMap<>();
        data.put("chart", balanceSheetRepository.getForDashboard());
        return ResponseEntity.status(HttpStatus.OK).body(data);
    }

    public ResponseEntity<?> getBalanceSheet(String date) {
        if (date == null) {
            date = LocalDate.now().toString();
        }
        Optional<BalanceSheet> byId = balanceSheetRepository.findByDate(date);
        if (byId.isPresent()) {
            Map<String, Object> data = new HashMap<>();

            data.put("balance", byId.get());
            List<Transaction> byDate = transactionRepository.findByDate(byId.get().getDate());
            Double opening = byId.get().getOpening();
            for (Transaction x : byDate) {
                if (x.getInAmount() > 0) {
                    x.setBalance(opening + x.getInAmount());
                    opening = x.getBalance();
                }
                if (x.getOutAmount() > 0) {
                    x.setBalance(opening - x.getOutAmount());
                    opening = x.getBalance();
                }
            }
            data.put("table", byDate);
            return ResponseEntity.status(HttpStatus.OK).body(data);
        } else {
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(null);
        }
    }

    // Create a new balance sheet
    public ResponseEntity<?> createBalanceSheet(BalanceSheet balanceSheet) {
        Optional<BalanceSheet> byDate = balanceSheetRepository.findByDate(balanceSheet.getDate());
        if (byDate.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Already Available");
        } else {
            balanceSheetRepository.save(balanceSheet);
            return ResponseEntity.status(HttpStatus.CREATED).body("Saved");
        }

    }

    // Update an existing balance sheet
    public ResponseEntity<?> updateBalanceSheet(BalanceSheet sheet) throws Exception {
        return balanceSheetRepository.findById(sheet.getId())
                .map(balanceSheet -> {
                    balanceSheet.setOpening(sheet.getOpening());
                    balanceSheet.setClosing(sheet.getClosing());
                    balanceSheetRepository.save(balanceSheet);
                    return ResponseEntity.status(HttpStatus.OK).body("Updated");
                })
                .orElseThrow(() -> new Exception("BalanceSheet not found with id " + sheet.getId()));
    }

    // Delete a balance sheet
    public ResponseEntity<?> deleteBalanceSheet(Integer id) {
        balanceSheetRepository.deleteById(id);
        return ResponseEntity.status(HttpStatus.OK).body("Deleted");
    }

    public ResponseEntity<?> closeBalanceSheet(Integer id) throws Exception {
        return balanceSheetRepository.findById(id)
                .map(x -> {
                    double sum = transactionRepository.findByDate(x.getDate())
                            .stream()
                            .filter(Transaction::isActive)
                            .mapToDouble(t -> t.getInAmount() - t.getOutAmount())
                            .sum();
                    x.setClosing(x.getOpening() + sum);
                    balanceSheetRepository.save(x);

                    return ResponseEntity.status(HttpStatus.OK).body("Account Close for the Day: " + x.getDate());

                })
                .orElseThrow(() -> new Exception("BalanceSheet not found with id "));

    }

}

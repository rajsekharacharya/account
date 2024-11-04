package com.app.account.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.app.account.model.BalanceSheet;
import com.app.account.repository.BalanceSheetRepository;

@Service
public class BalanceSheetService {

    @Autowired
    private BalanceSheetRepository balanceSheetRepository;

    // Get all balance sheets
    public List<BalanceSheet> getAllBalanceSheets() {
        return balanceSheetRepository.findAll();
    }

    // Get balance sheet by ID
    public Optional<BalanceSheet> getBalanceSheetById(Integer id) {
        return balanceSheetRepository.findById(id);
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
}

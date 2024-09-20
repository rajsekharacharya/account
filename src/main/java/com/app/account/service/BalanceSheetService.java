package com.app.account.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
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
    public BalanceSheet createBalanceSheet(BalanceSheet balanceSheet) {
        return balanceSheetRepository.save(balanceSheet);
    }

    // Update an existing balance sheet
    public BalanceSheet updateBalanceSheet(BalanceSheet sheet) throws Exception {
        return balanceSheetRepository.findById(sheet.getId())
                .map(balanceSheet -> {
                    balanceSheet.setOpening(sheet.getOpening());
                    balanceSheet.setClosing(sheet.getClosing());
                    return balanceSheetRepository.save(balanceSheet);
                })
                .orElseThrow(() -> new Exception("BalanceSheet not found with id " + sheet.getId()));
    }

    // Delete a balance sheet
    public void deleteBalanceSheet(Integer id) {
        balanceSheetRepository.deleteById(id);
    }
}

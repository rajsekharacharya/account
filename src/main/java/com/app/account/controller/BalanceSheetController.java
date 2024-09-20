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

import com.app.account.model.BalanceSheet;
import com.app.account.service.BalanceSheetService;

@RestController
@RequestMapping("/api/balance-sheets")
public class BalanceSheetController {

    @Autowired
    private BalanceSheetService balanceSheetService;

    // Get all balance sheets
    @GetMapping
    public List<BalanceSheet> getAllBalanceSheets() {
        return balanceSheetService.getAllBalanceSheets();
    }

    // Get balance sheet by ID
    @GetMapping()
    public ResponseEntity<BalanceSheet> getBalanceSheetById(@RequestParam Integer id) {
        return balanceSheetService.getBalanceSheetById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create a new balance sheet
    @PostMapping
    public BalanceSheet createBalanceSheet(@RequestBody BalanceSheet balanceSheet) {
        return balanceSheetService.createBalanceSheet(balanceSheet);
    }

    // Update an existing balance sheet
    @PutMapping()
    public ResponseEntity<BalanceSheet> updateBalanceSheet(@RequestBody BalanceSheet balanceSheetDetails)
            throws Exception {
        return ResponseEntity.ok(balanceSheetService.updateBalanceSheet(balanceSheetDetails));
    }

    // Delete a balance sheet
    @DeleteMapping()
    public ResponseEntity<Void> deleteBalanceSheet(@RequestParam Integer id) {
        balanceSheetService.deleteBalanceSheet(id);
        return ResponseEntity.noContent().build();
    }
}

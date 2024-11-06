package com.app.account.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
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
    @GetMapping(value = "/getDataForDashBoard")
    public ResponseEntity<?> getDataForDashBoard() {
        return balanceSheetService.getDataForDashBoard();
    }
    // Get all balance sheets
    @GetMapping
    public List<BalanceSheet> getAllBalanceSheets() {
        return balanceSheetService.getAllBalanceSheets();
    }

    @GetMapping(value = "/getMonthly")
    public List<BalanceSheet> getMonthly() {
        return balanceSheetService.getMonthly();
    }

    // Get balance sheet by ID
    @GetMapping(value = "/byId")
    public ResponseEntity<BalanceSheet> getBalanceSheetById(@RequestParam Integer id) {
        return balanceSheetService.getBalanceSheetById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @GetMapping(value = "/getBalanceSheet",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getBalanceSheet(@RequestParam(required = false) String date) {
        return balanceSheetService.getBalanceSheet(date);
    }
    @GetMapping(value = "/getHeadBalanceSheet")
    public ResponseEntity<?> getHeadBalanceSheet(@RequestParam Integer particularId,@RequestParam String start,@RequestParam String end) {
        return balanceSheetService.getHeadBalanceSheet(particularId,start,end);
    }

    @GetMapping(value = "/getBalanceByDate")
    public ResponseEntity<?> getBalanceByDate(@RequestParam String start,@RequestParam String end) {
        return balanceSheetService.getBalanceByDate(start,end);
    }

    // Create a new balance sheet
    @PostMapping(value = "/add", consumes = "application/json")
    public ResponseEntity<?> createBalanceSheet(@RequestBody BalanceSheet balanceSheet) {
        return balanceSheetService.createBalanceSheet(balanceSheet);
    }

    // Update an existing balance sheet
    @PutMapping(value = "/update", consumes = "application/json")
    public ResponseEntity<?> updateBalanceSheet(@RequestBody BalanceSheet balanceSheetDetails)
            throws Exception {
        return ResponseEntity.ok(balanceSheetService.updateBalanceSheet(balanceSheetDetails));
    }

    // Update an existing balance sheet
    @PutMapping(value = "/close")
    public ResponseEntity<?> closeBalanceSheet(@RequestParam Integer id)
            throws Exception {
        return balanceSheetService.closeBalanceSheet(id);
    }

    // Delete a balance sheet
    @DeleteMapping()
    public ResponseEntity<?> deleteBalanceSheet(@RequestParam Integer id) {
        return balanceSheetService.deleteBalanceSheet(id);
    }
}

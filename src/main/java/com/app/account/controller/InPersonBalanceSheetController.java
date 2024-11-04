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

import com.app.account.model.InPersonBalanceSheet;
import com.app.account.service.InPersonBalanceSheetService;

@RestController
@RequestMapping("/api/in-person-balance-sheets")
public class InPersonBalanceSheetController {

    @Autowired
    private InPersonBalanceSheetService inPersonBalanceSheetService;

    // Get all InPersonBalanceSheets
    @GetMapping
    public List<InPersonBalanceSheet> getAllInPersonBalanceSheets() {
        return inPersonBalanceSheetService.getAllInPersonBalanceSheets();
    }

    // Get InPersonBalanceSheet by ID
    @GetMapping(value = "/byId")
    public ResponseEntity<InPersonBalanceSheet> getInPersonBalanceSheetById(@RequestParam Integer id) {
        return inPersonBalanceSheetService.getInPersonBalanceSheetById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create a new InPersonBalanceSheet
    @PostMapping
    public InPersonBalanceSheet createInPersonBalanceSheet(@RequestBody InPersonBalanceSheet inPersonBalanceSheet) {
        return inPersonBalanceSheetService.createInPersonBalanceSheet(inPersonBalanceSheet);
    }

    // Update an existing InPersonBalanceSheet
    @PutMapping()
    public ResponseEntity<InPersonBalanceSheet> updateInPersonBalanceSheet(
            @RequestBody InPersonBalanceSheet inPersonBalanceSheetDetails) throws Exception {
        return ResponseEntity.ok(inPersonBalanceSheetService.updateInPersonBalanceSheet(inPersonBalanceSheetDetails));
    }

    // Delete an InPersonBalanceSheet
    @DeleteMapping()
    public ResponseEntity<Void> deleteInPersonBalanceSheet(@RequestParam Integer id) {
        inPersonBalanceSheetService.deleteInPersonBalanceSheet(id);
        return ResponseEntity.noContent().build();
    }
}


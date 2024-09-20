package com.app.account.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.app.account.model.InPersonBalanceSheet;
import com.app.account.repository.InPersonBalanceSheetRepository;

@Service
public class InPersonBalanceSheetService {

    @Autowired
    private InPersonBalanceSheetRepository inPersonBalanceSheetRepository;

    // Get all InPersonBalanceSheets
    public List<InPersonBalanceSheet> getAllInPersonBalanceSheets() {
        return inPersonBalanceSheetRepository.findAll();
    }

    // Get InPersonBalanceSheet by ID
    public Optional<InPersonBalanceSheet> getInPersonBalanceSheetById(Integer id) {
        return inPersonBalanceSheetRepository.findById(id);
    }

    // Create a new InPersonBalanceSheet
    public InPersonBalanceSheet createInPersonBalanceSheet(InPersonBalanceSheet inPersonBalanceSheet) {
        return inPersonBalanceSheetRepository.save(inPersonBalanceSheet);
    }

    // Update an existing InPersonBalanceSheet
    public InPersonBalanceSheet updateInPersonBalanceSheet(InPersonBalanceSheet inPersonBalanceSheetDetails) throws Exception {
        return inPersonBalanceSheetRepository.findById(inPersonBalanceSheetDetails.getId())
                .map(inPersonBalanceSheet -> {
                    inPersonBalanceSheet.setPersonId(inPersonBalanceSheetDetails.getPersonId());
                    inPersonBalanceSheet.setDate(inPersonBalanceSheetDetails.getDate());
                    inPersonBalanceSheet.setOpening(inPersonBalanceSheetDetails.getOpening());
                    inPersonBalanceSheet.setClosing(inPersonBalanceSheetDetails.getClosing());
                    return inPersonBalanceSheetRepository.save(inPersonBalanceSheet);
                })
                .orElseThrow(() -> new Exception("BalanceSheet not found with id " + inPersonBalanceSheetDetails.getId()));
    }

    // Delete an InPersonBalanceSheet
    public void deleteInPersonBalanceSheet(Integer id) {
        inPersonBalanceSheetRepository.deleteById(id);
    }
}

package com.app.account.service;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.app.account.model.Particulars;
import com.app.account.repository.ParticularsRepository;

@Service
public class ParticularsService {

    @Autowired
    private ParticularsRepository particularsRepository;

    // Get all particulars
    public List<Particulars> getAllParticulars() {
        return particularsRepository.findAll();
    }

    public List<Particulars> getAllParticularsHead() {
        return particularsRepository.findByTypeAndActive("HEAD",true);
    }

    // Get particulars by ID
    public Optional<Particulars> getParticularsById(Integer id) {
        return particularsRepository.findById(id);
    }

    // Create a new particulars
    public ResponseEntity<?> createParticulars(Particulars particulars) {
        particularsRepository.save(particulars);
        return ResponseEntity.status(HttpStatus.OK).body("Saved");
    }

    // Update an existing particulars
    public ResponseEntity<?> updateParticulars(Particulars particularsDetails) throws Exception {
        return particularsRepository.findById(particularsDetails.getId())
                .map(particulars -> {
                    particulars.setName(particularsDetails.getName());
                    particulars.setType(particularsDetails.getType());
                    particulars.setOpeningBalance(particularsDetails.getOpeningBalance());
                    particularsRepository.save(particulars);
                    return ResponseEntity.status(HttpStatus.OK).body("Updated");
                })
                .orElseThrow(() -> new Exception("BalanceSheet not found with id " + particularsDetails.getId()));
    }

    // Delete particulars
    public ResponseEntity<?> deleteParticulars(Integer id) {
        Optional<Particulars> byId = particularsRepository.findById(id);
        Map<Boolean, String> messages = new HashMap<>();
        messages.put(true, "Deactivate");
        messages.put(false, "Activate");

        String message = byId.map(particular -> {
            particular.setActive(!particular.isActive());
            particularsRepository.save(particular);
            return messages.get(particular.isActive());
        }).orElse("Not Found");

        return ResponseEntity.status(message.equals("Not Found") ? HttpStatus.BAD_REQUEST : HttpStatus.OK)
                .body(message);
    }


}

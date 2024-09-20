package com.app.account.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
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

    // Get particulars by ID
    public Optional<Particulars> getParticularsById(Integer id) {
        return particularsRepository.findById(id);
    }

    // Create a new particulars
    public Particulars createParticulars(Particulars particulars) {
        return particularsRepository.save(particulars);
    }

    // Update an existing particulars
    public Particulars updateParticulars(Particulars particularsDetails) throws Exception {
        return particularsRepository.findById(particularsDetails.getId())
                .map(particulars -> {
                    particulars.setName(particularsDetails.getName());
                    particulars.setType(particularsDetails.getType());
                    particulars.setCost(particularsDetails.getCost());
                    return particularsRepository.save(particulars);
                })
                .orElseThrow(() -> new Exception("BalanceSheet not found with id " + particularsDetails.getId()));
    }

    // Delete particulars
    public void deleteParticulars(Integer id) {
        particularsRepository.deleteById(id);
    }
}

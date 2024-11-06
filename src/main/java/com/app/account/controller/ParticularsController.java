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

import com.app.account.model.Particulars;
import com.app.account.service.ParticularsService;

@RestController
@RequestMapping("/api/particulars")
public class ParticularsController {

    @Autowired
    private ParticularsService particularsService;

    // Get all particulars
    @GetMapping
    public List<Particulars> getAllParticulars() {
        return particularsService.getAllParticulars();
    }
    @GetMapping(value = "/getByType")
    public List<Particulars> getAllParticularsHead() {
        return particularsService.getAllParticularsHead();
    }

    // Get particulars by ID
    @GetMapping(value = "/byId")
    public ResponseEntity<?> getParticularsById(@RequestParam Integer id) {
        return particularsService.getParticularsById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create a new particulars
    @PostMapping
    public ResponseEntity<?> createParticulars(@RequestBody Particulars particulars) {
        return particularsService.createParticulars(particulars);
    }

    // Update an existing particulars
    @PutMapping
    public ResponseEntity<?> updateParticulars(@RequestBody Particulars particularsDetails) throws Exception {
        return ResponseEntity.ok(particularsService.updateParticulars(particularsDetails));
    }

    // Delete particulars
    @DeleteMapping()
    public ResponseEntity<?> deleteParticulars(@RequestParam Integer id) {
        return particularsService.deleteParticulars(id);
         
    }
}
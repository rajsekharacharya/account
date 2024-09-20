package com.app.account.service.impl;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.app.account.model.MyUserDetails;
import com.app.account.service.DashboardService;
import com.vareli.srmps.repository.CompanyRepository;
import com.vareli.srmps.repository.PlantRepository;
import com.vareli.srmps.repository.TokenRepository;
import com.vareli.srmps.repository.WeighBridgeRepository;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final CompanyRepository companyRepository;
    private final PlantRepository plantRepository;
    private final WeighBridgeRepository weighBridgeRepository;
    private final TokenRepository tokenRepository;

   @Autowired
   public DashboardServiceImpl(CompanyRepository companyRepository, PlantRepository plantRepository,WeighBridgeRepository weighBridgeRepository, TokenRepository tokenRepository) {
       this.companyRepository = companyRepository;
       this.plantRepository = plantRepository;
       this.weighBridgeRepository = weighBridgeRepository;
       this.tokenRepository = tokenRepository;
   }

    @Override
    public ResponseEntity<?> getDashboardForSuperAdmin() {
        Map<String, Object> data = new HashMap<>();
        data.put("TotalCompany", companyRepository.getTotalCompany());
        data.put("TotalPlant", plantRepository.getTotalPlant());
        data.put("TotalWeighBridge", weighBridgeRepository.getTotalWeighBridge());
        data.put("data", weighBridgeRepository.getWeighBridgeData());
        return ResponseEntity.status(HttpStatus.CREATED).body(data);
    }

    @Override
    public ResponseEntity<?> getDashboardForAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        MyUserDetails user = (MyUserDetails) auth.getPrincipal();
        Map<String, Object> dashboardDataCompany = tokenRepository.getDashboardDataCompany(user.getCompanyId(),
                LocalDate.now().withDayOfMonth(1).toString(), LocalDate.now().toString());
        List<Map<String, Object>> vendorInfoCompany = tokenRepository.getVendorInfoCompany(user.getCompanyId(),
                LocalDate.now().withDayOfMonth(1).toString(), LocalDate.now().toString());
        List<Map<String, Object>> itemInfoCompany = tokenRepository.getItemInfoCompany(user.getCompanyId(),
                LocalDate.now().withDayOfMonth(1).toString(), LocalDate.now().toString());
        Map<String, Object> data = new HashMap<>();
        data.put("ViewData", dashboardDataCompany);
        data.put("vendorData", vendorInfoCompany);
        data.put("ItemData", itemInfoCompany);
        return ResponseEntity.status(HttpStatus.CREATED).body(data);
    }

    @Override
    public ResponseEntity<?> getDashboardForPlant() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        MyUserDetails user = (MyUserDetails) auth.getPrincipal();

        Map<String, Object> dashboardDataPlant = tokenRepository.getDashboardDataPlant(user.getPlantId(),
                LocalDate.now().withDayOfMonth(1).toString(), LocalDate.now().toString());
        List<Map<String, Object>> vendorInfoPlant = tokenRepository.getVendorInfoPlant(user.getPlantId(),
                LocalDate.now().withDayOfMonth(1).toString(), LocalDate.now().toString());
        List<Map<String, Object>> itemInfoPlant = tokenRepository.getItemInfoPlant(user.getPlantId(),
                LocalDate.now().withDayOfMonth(1).toString(), LocalDate.now().toString());
        Map<String, Object> data = new HashMap<>();
        data.put("ViewData", dashboardDataPlant);
        data.put("vendorData", vendorInfoPlant);
        data.put("ItemData", itemInfoPlant);
        return ResponseEntity.status(HttpStatus.CREATED).body(data);
    }

}

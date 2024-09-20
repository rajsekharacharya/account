package com.app.account.service;

import org.springframework.http.ResponseEntity;

public interface DashboardService {

    ResponseEntity<?> getDashboardForSuperAdmin();

    ResponseEntity<?> getDashboardForAdmin();
    
    ResponseEntity<?> getDashboardForPlant();




}

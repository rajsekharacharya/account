package com.app.account.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.account.service.DashboardService;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    @Autowired
    DashboardService dashboardService;

    @GetMapping(value = "/getDashboardForSuperAdmin")
    public ResponseEntity<?> getDashboardForSuperAdmin() {
        return dashboardService.getDashboardForSuperAdmin();
    }

    @GetMapping(value = "/getDashboardForAdmin")
    public ResponseEntity<?> getDashboardForAdmin() {
        return dashboardService.getDashboardForAdmin();
    }

    @GetMapping(value = "/getDashboardForPlant")
    public ResponseEntity<?> getDashboardForPlant() {
        return dashboardService.getDashboardForPlant();
    }

}

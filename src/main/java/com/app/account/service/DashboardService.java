package com.app.account.service;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

        public ResponseEntity<?> getDashboardData() {
                return ResponseEntity.status(HttpStatus.OK).body("NO DATA");
        }

}

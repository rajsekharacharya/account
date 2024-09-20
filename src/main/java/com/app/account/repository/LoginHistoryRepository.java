package com.app.account.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.account.model.LoginHistory;



public interface LoginHistoryRepository extends JpaRepository<LoginHistory,Long> {

    List<LoginHistory> findBySessionId(String sessionId);
    
}

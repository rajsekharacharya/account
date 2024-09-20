package com.app.account.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.app.account.model.Particulars;

@Repository
public interface ParticularsRepository extends JpaRepository<Particulars, Integer> {
}
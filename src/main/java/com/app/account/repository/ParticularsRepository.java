package com.app.account.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.app.account.model.Particulars;
import java.util.List;


@Repository
public interface ParticularsRepository extends JpaRepository<Particulars, Integer> {

    List<Particulars> findByTypeAndActive(String type,boolean active);
}
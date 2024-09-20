package com.app.account.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.account.model.User;



public interface UserRepository extends JpaRepository<User,Integer> {

    Optional<User> findByUsername(String username);

    List<User> findByCompanyId(Integer companyId);

    List<User> findByRoleInAndAttachTypeIn(List<String> roles,List<String> attachTypes);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
    
}

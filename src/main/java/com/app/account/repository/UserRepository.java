package com.app.account.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.account.model.User;

public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

}

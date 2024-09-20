package com.app.account.service;

import java.util.List;

import org.springframework.http.ResponseEntity;

import com.app.account.model.User;

public interface UserService {

    ResponseEntity<?> getUsers();

    ResponseEntity<?> getUser(Integer userId);

    ResponseEntity<?> putUser(User user);

    ResponseEntity<?> deleteUser(Integer id);

    Boolean emailAvailability(String email);

    Boolean usernameAvailability(String username);

    ResponseEntity<?> postUser(User user);

    ResponseEntity<?> getUsersForSuperAdmin();

    ResponseEntity<?> postUserForSuperAdmin(User user);

    ResponseEntity<?> getMenu();

    ResponseEntity<?> updatePermission(Integer id, List<String> permission);

    ResponseEntity<?> getUsersByLogin();

    
}

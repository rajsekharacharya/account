package com.app.account.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.app.account.model.User;
import com.app.account.service.UserService;

@RestController
@RequestMapping("/api/v1")
public class UserController {

    @Autowired
    UserService service;

    @GetMapping(value = "/getUsersByLogin")
    public ResponseEntity<?> getUsersByLogin() {
        return service.getUsersByLogin();
    }

    @GetMapping(value = "/getUsersForSuperAdmin")
    public ResponseEntity<?> getUsersForSuperAdmin() {
        return service.getUsersForSuperAdmin();
    }
    @GetMapping(value = "/getUsers")
    public ResponseEntity<?> getUsers() {
        return service.getUsers();
    }
    @GetMapping(value = "/getUser")
    public ResponseEntity<?> getUser(@RequestParam Integer userId) {
        return service.getUser(userId);
    }

    @PostMapping(value = "/postUserForSuperAdmin")
    public ResponseEntity<?> postUserForSuperAdmin(@RequestBody User user) {
        return service.postUserForSuperAdmin(user);
    }
    @PostMapping(value = "/postUser")
    public ResponseEntity<?> postUser(@RequestBody User user) {
        return service.postUser(user);
    }
    
    @PutMapping(value = "/putUser")
    public ResponseEntity<?> putUser(@RequestBody User user) {
        return service.putUser(user);
    }


    @GetMapping(value = "/usernameAvailability")
    public Boolean usernameAvailability(@RequestParam String username) {
        return service.usernameAvailability(username);
    }

    @GetMapping(value = "/emailAvailability")
    public Boolean emailAvailability(@RequestParam String email) {
        return service.emailAvailability(email);
    }

    @DeleteMapping(value = "/deleteUser")
    public ResponseEntity<?> deleteUser(@RequestParam Integer id) {
        return service.deleteUser(id);
    }


    @GetMapping(value = "/getMenu")
    public ResponseEntity<?> getMenu() {
        return service.getMenu();
    }

    @PutMapping(value = "/updatePermission")
    public ResponseEntity<?> updatePermission(@RequestParam Integer id, @RequestParam List<String> permission) {
        return service.updatePermission(id,permission);
    }

}

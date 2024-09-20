package com.app.account.controller;

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
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    UserService service;

    @GetMapping(value = "/getCurrentUser")
    public ResponseEntity<?> getCurrentUser() {
        return service.getCurrentUser();
    }

    @GetMapping(value = "/getUsers")
    public ResponseEntity<?> getUsers() {
        return service.getUsers();
    }

    @GetMapping(value = "/getUserById")
    public ResponseEntity<?> getUserById(@RequestParam Integer id) {
        return service.getUserById(id);
    }

    @PostMapping(value = "/addUser", consumes = "application/json")
    public ResponseEntity<?> addUser(@RequestBody User user) {
        return service.addUser(user);
    }

    @PutMapping(value = "/updateUser", consumes = "application/json")
    public ResponseEntity<?> updateUser(@RequestBody User user) {
        return service.updateUser(user);
    }

    @DeleteMapping(value = "/deleteUser")
    public ResponseEntity<?> deleteUser(@RequestParam Integer id) {
        return service.deleteUser(id);
    }

    @PutMapping(value = "/accountStatusToggle")
    public ResponseEntity<?> accountStatusToggle(@RequestParam Integer id) {
        return service.accountStatusToggle(id);
    }

    @GetMapping(value = "/usernameAvailability")
    public Boolean usernameAvailability(@RequestParam String username) {
        return service.usernameAvailability(username);
    }

    @GetMapping(value = "/emailAvailability")
    public Boolean emailAvailability(@RequestParam String email) {
        return service.emailAvailability(email);
    }

    @GetMapping(value = "/resetPassword")
    public ResponseEntity<?> resetPassword(@RequestParam Integer id, @RequestParam String password) {
        return service.resetPassword(id, password);
    }

}

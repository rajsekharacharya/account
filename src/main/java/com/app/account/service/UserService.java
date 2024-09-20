package com.app.account.service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.app.account.model.MyUserDetails;
import com.app.account.model.User;
import com.app.account.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class UserService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    public ResponseEntity<?> getUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    public ResponseEntity<?> addUser(User user) {
        String password = user.getRawPassword();
        String encode = passwordEncoder.encode(password);
        user.setPassword(encode);
        user.setEnable(true);

        if (userRepository.existsByUsername(user.getUsername()) || userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username or Email Already Exists !");
        } else {
            userRepository.save(user);
            return ResponseEntity.status(HttpStatus.CREATED).body("User successfully created");
        }
    }

    public ResponseEntity<?> getUserById(Integer id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            return ResponseEntity.status(HttpStatus.FOUND).body(user.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User Not Found");
        }
    }

    public ResponseEntity<?> updateUser(User user) {
        if (user.getRawPassword() == null) {
            user.setPassword(userRepository.findById(user.getId()).get().getPassword());
        } else {
            String password = user.getRawPassword();
            String encode = passwordEncoder.encode(password);
            user.setPassword(encode);
        }
        user.setEnable(true);
        userRepository.save(user);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body("User successfully Updated!!");
    }

    public ResponseEntity<?> deleteUser(Integer id) {
        User user = userRepository.findById(id).get();
        user.setEnable(false);
        userRepository.save(user);
        return new ResponseEntity<String>("User Deleted!!", HttpStatus.CREATED);
    }

    public ResponseEntity<?> accountStatusToggle(Integer id) {
        Optional<User> userOptional = userRepository.findById(id);
        Map<Boolean, String> messages = new HashMap<>();
        messages.put(true, "User Enabled");
        messages.put(false, "User Disabled");

        String message = userOptional
                .map(user -> {
                    user.setEnable(!user.isEnable());
                    userRepository.save(user);
                    return messages.get(user.isEnable());
                })
                .orElse("User Not Found");

        return ResponseEntity.status(message.equals("User Not Found") ? HttpStatus.BAD_REQUEST : HttpStatus.OK)
                .body(message);
    }

    public Boolean usernameAvailability(String username) {
        return userRepository.existsByUsername(username);
    }

    public Boolean emailAvailability(String email) {
        return userRepository.existsByEmail(email);
    }

    public ResponseEntity<?> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        MyUserDetails user = (MyUserDetails) auth.getPrincipal();

        Optional<User> byId = userRepository.findById(user.getUser().getId());
        if (byId.isPresent()) {
            return ResponseEntity.status(HttpStatus.OK).body(byId.get());
        } else {
            return new ResponseEntity<String>("User Not Found", HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<?> resetPassword(Integer id, String password) {
        Optional<User> byId = userRepository.findById(id);
        if (byId.isPresent()) {
            byId.get().setPassword(passwordEncoder.encode(password));
            userRepository.save(byId.get());
            return new ResponseEntity<String>("Password Reset Successfully", HttpStatus.ACCEPTED);
        } else {
            return new ResponseEntity<String>("User Not Found", HttpStatus.NOT_FOUND);
        }
    }

}
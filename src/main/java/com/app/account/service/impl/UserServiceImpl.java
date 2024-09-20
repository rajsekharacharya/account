package com.app.account.service.impl;

import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

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
import com.app.account.service.UserService;
import com.vareli.srmps.model.UserPermission;

@Service
public class UserServiceImpl implements UserService {


    private final UserRepository userRepository;
   private final PasswordEncoder encoder;

   @Autowired
   public UserServiceImpl(UserRepository userRepository, PasswordEncoder encoder) {
       this.userRepository = userRepository;
       this.encoder = encoder;
   }

    @Override
    public ResponseEntity<?> getUsersByLogin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        MyUserDetails userDetail = (MyUserDetails) auth.getPrincipal();
        return userRepository.findByUsername(userDetail.getUsername())
                .map(user -> ResponseEntity.status(HttpStatus.OK).body(user))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());

    }

    @Override
    public ResponseEntity<?> getUsers() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        MyUserDetails userDetail = (MyUserDetails) auth.getPrincipal();
        List<User> users = userRepository.findByCompanyId(userDetail.getCompanyId());
        return users.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.accepted().body(users);
    }

    @Override
    public ResponseEntity<?> getUsersForSuperAdmin() {
        List<User> users = userRepository.findByRoleInAndAttachTypeIn(Arrays.asList("SUPERADMIN", "ADMIN"),
                Arrays.asList("NA", "C"));
        return users.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.accepted().body(users);
    }

    @Override
    public ResponseEntity<?> getUser(Integer userId) {
        Optional<User> user = userRepository.findById(userId);
        return user.isPresent() ? ResponseEntity.accepted().body(user.get())
                : ResponseEntity.badRequest().body("User Not Found");
    }

    @Override
    public ResponseEntity<?> postUserForSuperAdmin(User user) {
        user.setPassword(encoder.encode(user.getRawPassword()));
        if (user.getRole().equals("SUPERADMIN")) {
            user.setCompanyId(0);
            user.setPlantId(0);
            user.setAttachType("NA");
        }
        if (user.getRole().equals("ADMIN")) {
            user.setPlantId(0);
            user.setAttachType("C");
        }
        if (user.getAttachType().equals("C")) {
            user.setPlantId(0);
        }
        if (user.getAttachType().equals("P")) {
            user.setCompanyId(0);
        }
        userRepository.save(user);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body("Created");
    }

    @Override
    public ResponseEntity<?> postUser(User user) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        MyUserDetails userDetail = (MyUserDetails) auth.getPrincipal();

        user.setPassword(encoder.encode(user.getRawPassword()));
        user.setCompanyId(userDetail.getCompanyId());

        if (user.getAttachType().equals("C")) {
            user.setPlantId(0);
        }
        userRepository.save(user);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body("Created");

    }

    @Override
    public ResponseEntity<String> putUser(User user) {
        return userRepository.findById(user.getId())
                .map(existingUser -> {
                    if ("SUPERADMIN".equals(user.getRole())) {
                        user.setCompanyId(0);
                        user.setPlantId(0);
                        user.setAttachType("NA");
                    }
                    if ("C".equals(user.getAttachType())) {
                        user.setPlantId(0);
                    }

                    // Ensure the permissions are associated with the user
                    user.getPermissions().forEach(permission -> permission.setUser(user));

                    // Handle password
                    if (user.getRawPassword() != null) {
                        user.setPassword(encoder.encode(user.getRawPassword()));
                    } else {
                        user.setPassword(existingUser.getPassword());
                    }

                    userRepository.save(user);
                    return ResponseEntity.status(HttpStatus.ACCEPTED).body("Updated");
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User Not Found"));
    }


    @Override
    public ResponseEntity<?> deleteUser(Integer id) {
        Optional<User> userOptional = userRepository.findById(id);
        Map<Boolean, String> messages = new HashMap<>();
        messages.put(true, "User Disable");
        messages.put(false, "User Enable");

        String message = userOptional
                .map(user -> {
                    user.setEnabled(!user.isEnabled());
                    userRepository.save(user);
                    return messages.get(user.isEnabled());
                })
                .orElse("User Not Found");

        return ResponseEntity.status(message.equals("User Not Found") ? HttpStatus.BAD_REQUEST : HttpStatus.OK)
                .body(message);
    }

    @Override
    public Boolean emailAvailability(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public Boolean usernameAvailability(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    public ResponseEntity<?> getMenu() {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No Use");
    }

    @Override
    public ResponseEntity<?> updatePermission(Integer id, List<String> permissions) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();

            // Existing permissions of the user
            Set<UserPermission> existingPermissions = user.getPermissions();

            // Create a set for new permissions to avoid duplicates
            Set<UserPermission> newPermissions = new HashSet<>();

            permissions.forEach(permissionName -> {
                // Check if the permission already exists
                boolean exists = existingPermissions.stream()
                        .anyMatch(permission -> permission.getName().equals(permissionName));

                // Add only if it does not exist already
                if (!exists) {
                    UserPermission newPermission = new UserPermission();
                    newPermission.setName(permissionName);
                    newPermission.setUser(user);
                    newPermission.setStatus(true);
                    newPermissions.add(newPermission);
                }
            });

            existingPermissions.forEach(permission -> permission.setStatus(permissions.contains(permission.getName())));

            // Add new permissions to the user's existing permissions
            existingPermissions.addAll(newPermissions);

            // Set the updated permissions back to the user
            user.setPermissions(existingPermissions);

            // Save the updated user
            userRepository.save(user);

            return ResponseEntity.status(HttpStatus.ACCEPTED).body("Permissions Updated");
        }

        return ResponseEntity.notFound().build();
    }

}

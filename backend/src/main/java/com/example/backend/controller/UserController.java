package com.example.backend.controller;

import com.example.backend.model.User;
import com.example.backend.model.Image;
import com.example.backend.service.UserService;
import com.example.backend.repository.ImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@CrossOrigin(maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private ImageRepository imageRepository;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        return userService.getUserByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        try {
            // Encode password before saving
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            return new ResponseEntity<>(userService.createUser(user), HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable String id,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String phone,
            @RequestPart(required = false) MultipartFile profileImage) {
        try {
            // Get existing user
            User existingUser = userService.getUserById(id)
                    .orElseThrow(() -> new RuntimeException("User not found with id " + id));

            // Update user fields if provided
            if (name != null) existingUser.setName(name);
            if (email != null) existingUser.setEmail(email);
            if (phone != null) existingUser.setPhone(phone);

            // Handle profile image upload
            if (profileImage != null) {
                // Delete old image if exists
                if (existingUser.getProfileImage() != null) {
                    imageRepository.deleteById(existingUser.getProfileImage());
                }

                // Create and save new image
                Image image = new Image();
                image.setName(profileImage.getOriginalFilename());
                image.setContentType(profileImage.getContentType());
                image.setData(profileImage.getBytes());
                image.setEntityType("user");
                image.setEntityId(id);

                Image savedImage = imageRepository.save(image);
                existingUser.setProfileImage(savedImage.getId());
            }

            // Save updated user
            User updatedUser = userService.updateUser(id, existingUser);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
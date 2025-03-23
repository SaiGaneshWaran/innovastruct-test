package com.example.backend.controller;

import com.example.backend.model.User;
import com.example.backend.model.Tender;
import com.example.backend.service.UserService;
import com.example.backend.service.TenderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(maxAge = 3600)
@RestController
@RequestMapping("/api/clients")
public class ClientController {

    @Autowired
    private UserService userService;

    @Autowired
    private TenderService tenderService;

    @GetMapping
    public ResponseEntity<List<User>> getAllClients() {
        // Get all users with role CLIENT
        List<User> clients = userService.getUsersByRole("CLIENT");
        return ResponseEntity.ok(clients);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getClientById(@PathVariable String id) {
        return userService.getUserById(id)
                .filter(user -> "CLIENT".equals(user.getRole()))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/tenders")
    public ResponseEntity<List<Tender>> getClientTenders(@PathVariable String id) {
        // First check if client exists
        Optional<User> client = userService.getUserById(id);
        if (client.isEmpty() || !"CLIENT".equals(client.get().getRole())) {
            return ResponseEntity.notFound().build();
        }

        // Get tenders for this client
        List<Tender> tenders = tenderService.getTendersByClientId(id);
        return ResponseEntity.ok(tenders);
    }

    @PostMapping
    public ResponseEntity<User> createClient(@RequestBody User user) {
        try {
            // Ensure role is set to CLIENT
            user.setRole("CLIENT");
            User createdUser = userService.createUser(user);
            return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateClient(@PathVariable String id, @RequestBody User userDetails) {
        try {
            // First check if user exists and is a client
            Optional<User> existingUser = userService.getUserById(id);
            if (existingUser.isEmpty() || !"CLIENT".equals(existingUser.get().getRole())) {
                return ResponseEntity.notFound().build();
            }

            // Ensure role remains CLIENT
            userDetails.setRole("CLIENT");
            User updatedUser = userService.updateUser(id, userDetails);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable String id) {
        // First check if user exists and is a client
        Optional<User> existingUser = userService.getUserById(id);
        if (existingUser.isEmpty() || !"CLIENT".equals(existingUser.get().getRole())) {
            return ResponseEntity.notFound().build();
        }

        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
package com.quizzard.app.controller;


import com.quizzard.app.dto.UserProfileUpdateDTO;
import com.quizzard.app.dto.UserResponseDTO;
import com.quizzard.app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        List<UserResponseDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PostMapping("/{id}/avatar")
    public ResponseEntity<String> updateUserProfile(@PathVariable Long id, @ModelAttribute UserProfileUpdateDTO userProfileUpdateDTO) {
        try {
            userService.updateProfile(id, userProfileUpdateDTO);
            return ResponseEntity.ok("Profile updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to update profile");
        }
    }
}

package com.quizzard.app.controller;

import com.quizzard.app.domain.dto.request.MyProfileRequestDTO;
import com.quizzard.app.domain.dto.response.UserResponseDTO;
import com.quizzard.app.service.UserService;
import com.quizzard.app.tracker.UserStatusTracker;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.util.Set;


@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserStatusTracker userStatusTracker;


    @PostMapping("/{userId}/avatar")
    public ResponseEntity<?> updateUserProfile(@PathVariable Long userId, @ModelAttribute MyProfileRequestDTO myProfileRequestDTO) {
        try {
            UserResponseDTO userResponseDTO =  userService.updateProfile(userId, myProfileRequestDTO);
            return ResponseEntity.ok(userResponseDTO);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to update profile");
        }
    }

    @PostMapping("/{userId}/roles/add")
    public ResponseEntity<String> addRoleToUser(@PathVariable Long userId, @RequestParam String role) {
        userService.addRole(userId, role);
        return ResponseEntity.ok("Role " + role + " added to user " + userId);
    }

    @PostMapping("/{userId}/roles/remove")
    public ResponseEntity<String> removeRoleFromUser(@PathVariable Long userId, @RequestParam String role) {
        userService.removeRole(userId, role);
        return ResponseEntity.ok("Role " + role + " removed from user " + userId);
    }

    @MessageMapping("/status/online")
    @SendTo("/topic/user-status")
    public Set<Long> userIsOnline(
            @Payload Long userId) {
        userStatusTracker.addUser(userId);
        return userStatusTracker.getOnlineUsers();
    }

    @MessageMapping("/status/offline")
    @SendTo("/topic/user-status")
    public Set<Long> userIsOffline(
            @Payload Long userId) {
        userStatusTracker.removeUser(userId);
        return userStatusTracker.getOnlineUsers();
    }
}

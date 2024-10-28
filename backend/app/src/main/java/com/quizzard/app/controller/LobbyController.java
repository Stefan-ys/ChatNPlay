package com.quizzard.app.controller;

import com.quizzard.app.dto.response.LobbyResponseDTO;
import com.quizzard.app.service.LobbyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/lobbies")
public class LobbyController {

    @Autowired
    private LobbyService lobbyService;

    @GetMapping("/{lobbyId}")
    public ResponseEntity<LobbyResponseDTO> getLobby(@PathVariable Long lobbyId) {
        LobbyResponseDTO lobby = lobbyService.getLobbyById(lobbyId);
        return ResponseEntity.ok(lobby);
    }

    @GetMapping("/name/{lobbyName}")
    public ResponseEntity<LobbyResponseDTO> getLobbyByName(@PathVariable String lobbyName) {
        LobbyResponseDTO lobby = lobbyService.getLobbyByName(lobbyName);
        return ResponseEntity.ok(lobby);
    }

    @PostMapping("/{lobbyId}/users/{userId}")
    public ResponseEntity<LobbyResponseDTO> addUserToLobby(@PathVariable Long lobbyId, @PathVariable Long userId) {
        LobbyResponseDTO updatedLobby = lobbyService.addUserToLobby(lobbyId, userId);
        return ResponseEntity.ok(updatedLobby);
    }

    @DeleteMapping("/{lobbyId}/users/{userId}")
    public ResponseEntity<LobbyResponseDTO> removeUserFromLobby(@PathVariable Long lobbyId, @PathVariable Long userId) {
        LobbyResponseDTO updatedLobby = lobbyService.removeUserFromLobby(lobbyId, userId);
        return ResponseEntity.ok(updatedLobby);
    }
}

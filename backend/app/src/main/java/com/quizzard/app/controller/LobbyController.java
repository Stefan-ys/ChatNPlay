package com.quizzard.app.controller;


import com.quizzard.app.dto.response.LobbyResponseDTO;
import com.quizzard.app.dto.response.UserResponseDTO;
import com.quizzard.app.service.LobbyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lobbies")
@CrossOrigin(origins = "http://localhost:5173")
public class LobbyController {

    @Autowired
    private LobbyService lobbyService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @GetMapping("/{lobbyId}")
    public LobbyResponseDTO getLobby(@PathVariable Long lobbyId) {
        LobbyResponseDTO lobby = lobbyService.getLobbyById(lobbyId);

        messagingTemplate.convertAndSend("/topic/lobbies/" + lobbyId, lobby);

        return lobby;
    }

    @MessageMapping("/lobbies/{lobbyId}")
    @SendTo("/topic/lobbies/{lobbyId}")
    public LobbyResponseDTO updateLobby(@PathVariable Long lobbyId) {
        return lobbyService.getLobbyById(lobbyId);
    }
}

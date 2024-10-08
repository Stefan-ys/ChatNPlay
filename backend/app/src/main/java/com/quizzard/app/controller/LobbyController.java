package com.quizzard.app.controller;


import com.quizzard.app.dto.response.LobbyResponseDTO;
import com.quizzard.app.service.LobbyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/lobbies")
public class LobbyController {

    @Autowired
    private LobbyService lobbyService;


    @GetMapping("/{lobbyId}")
    public LobbyResponseDTO getLobby(@PathVariable Long lobbyId) {
        return lobbyService.getLobbyById(lobbyId);
    }
}

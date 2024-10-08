package com.quizzard.app.service;

import com.quizzard.app.dto.response.LobbyResponseDTO;

public interface LobbyService {
    LobbyResponseDTO createLobby();


    LobbyResponseDTO getLobbyById(Long id);
}

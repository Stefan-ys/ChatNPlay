package com.quizzard.app.service;

import com.quizzard.app.domain.dto.response.LobbyResponseDTO;

public interface LobbyService {

    LobbyResponseDTO createLobby();

    LobbyResponseDTO getLobbyById(Long id);

    LobbyResponseDTO getLobbyByName(String lobbyName);
}

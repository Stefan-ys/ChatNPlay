package com.quizzard.app.service;

import com.quizzard.app.domain.dto.response.LobbyResponseDTO;

public interface LobbyService {

    LobbyResponseDTO createLobby();

    LobbyResponseDTO getLobbyById(Long id);

    LobbyResponseDTO getLobbyByName(String lobbyName);

    LobbyResponseDTO addUserToLobby(Long lobbyId, Long userId);

    LobbyResponseDTO removeUserFromLobby(Long lobbyId, Long userId);
}

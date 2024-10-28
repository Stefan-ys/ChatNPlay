package com.quizzard.app.service;

import com.quizzard.app.dto.response.CommentResponseDTO;
import com.quizzard.app.dto.response.LobbyResponseDTO;
import com.quizzard.app.entity.Comment;

public interface LobbyService {

    LobbyResponseDTO createLobby();

    LobbyResponseDTO getLobbyById(Long id);

    LobbyResponseDTO getLobbyByName(String lobbyName);

    LobbyResponseDTO addUserToLobby(Long lobbyId, Long userId);

    LobbyResponseDTO removeUserFromLobby(Long lobbyId, Long userId);
}

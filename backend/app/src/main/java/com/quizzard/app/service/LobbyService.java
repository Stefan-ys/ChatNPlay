package com.quizzard.app.service;

import com.quizzard.app.domain.dto.response.LobbyResponseDTO;
import com.quizzard.app.domain.dto.response.UserLobbyResponseDTO;

import java.util.List;
import java.util.Set;

public interface LobbyService {

    LobbyResponseDTO createLobby();

    LobbyResponseDTO getLobbyByName(String lobbyName);

    LobbyResponseDTO getLobbyById(long id);

    void addLobbyUser(long lobbyId, long userId);

    void removeLobbyUser(long lobbyId, long userId);

    void changeLobbyUserStatus(long lobbyId, long userId);

    List<UserLobbyResponseDTO> getUsersInLobby(long lobbyId);

    Set<Long> getReadyUsersInLobby(long lobbyId);
}

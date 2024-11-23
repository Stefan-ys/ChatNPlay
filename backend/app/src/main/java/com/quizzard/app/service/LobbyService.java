package com.quizzard.app.service;

import com.quizzard.app.domain.dto.response.LobbyResponseDTO;

import java.util.Map;
import java.util.Set;

public interface LobbyService {

    LobbyResponseDTO createLobby();

    LobbyResponseDTO getLobbyByName(String lobbyName);

    LobbyResponseDTO getLobbyById(long id);

    void addLobbyUser(long lobbyId, long userId);

    void removeLobbyUser(long lobbyId, long userId);


    Set<Long> getUsersInLobby(long lobbyId);

    Set<Long> getReadyUsersInLobby(long lobbyId);

    Set<Long> changeLobbyUserStatus(Long lobbyId, Long userId);
}

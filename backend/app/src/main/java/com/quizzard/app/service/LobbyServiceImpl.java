package com.quizzard.app.service;

import com.quizzard.app.domain.dto.response.LobbyResponseDTO;
import com.quizzard.app.domain.entity.Lobby;
import com.quizzard.app.repository.LobbyRepository;
import com.quizzard.app.tracker.ChannelConnectionTracker;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.Iterator;
import java.util.Set;


@Service
@RequiredArgsConstructor
public class LobbyServiceImpl implements LobbyService {

    private final LobbyRepository lobbyRepository;
    private final ChannelConnectionTracker connectionTracker;
    private final ModelMapper modelMapper;


    @Override
    public LobbyResponseDTO createLobby() {
        Lobby lobby = new Lobby();

        return modelMapper.map(lobbyRepository.save(lobby), LobbyResponseDTO.class);
    }

    @Override
    public LobbyResponseDTO getLobbyByName(String name) {
        Lobby lobby = lobbyRepository.findByName(name)
                .orElseThrow(() -> new IllegalArgumentException("Lobby not found with name: " + name));

        return modelMapper.map(lobby, LobbyResponseDTO.class);
    }


    @Override
    public LobbyResponseDTO getLobbyById(long id) {
        Lobby lobby = lobbyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Lobby not found with id: " + id));

        return modelMapper.map(lobby, LobbyResponseDTO.class);
    }

    @Override
    public void addLobbyUser(long lobbyId, long userId) {
        connectionTracker.addUserToLobby(lobbyId, userId);
    }

    @Override
    public void removeLobbyUser(long lobbyId, long userId) {
        connectionTracker.removeUserFromLobby(lobbyId, userId);
    }

    @Override
    public Set<Long> getUsersInLobby(long lobbyId) {
        return connectionTracker.getUsersInLobby(lobbyId);
    }

    @Override
    public Set<Long> getReadyUsersInLobby(long lobbyId) {
        return connectionTracker.getReadyUsersInLobby(lobbyId);
    }

    @Override
    public Set<Long> changeLobbyUserStatus(Long lobbyId, Long userId) {
        connectionTracker.changeUserStatus(lobbyId, userId);
        Set<Long> readyUsers = connectionTracker.getReadyUsersInLobby(lobbyId);

        if (readyUsers.size() > 1) {
            Iterator<Long> iterator = readyUsers.iterator();

            long playerOneId = iterator.next();
            long playerTwoId = iterator.next();

            System.out.println("READY FOR GAME " + playerOneId + "vs" + playerTwoId );

            // TODO call start a game service
        }
        return connectionTracker.getUsersInLobby(lobbyId);
    }
}

package com.quizzard.app.service;

import com.quizzard.app.domain.dto.response.LobbyResponseDTO;
import com.quizzard.app.domain.dto.response.UserLobbyResponseDTO;
import com.quizzard.app.domain.entity.Lobby;
import com.quizzard.app.domain.entity.User;
import com.quizzard.app.repository.LobbyRepository;
import com.quizzard.app.repository.UserRepository;
import com.quizzard.app.tracker.ChannelConnectionTracker;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class LobbyServiceImpl implements LobbyService {

    private final LobbyRepository lobbyRepository;
    private final UserRepository userRepository;
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
    public List<UserLobbyResponseDTO> getUsersInLobby(long lobbyId) {
        Set<Long> usersInLobby = connectionTracker.getUsersByLobbyId(lobbyId);
        Set<Long> readyUsers = connectionTracker.getReadyUsersByLobbyId(lobbyId);

        return userRepository.findAllById(usersInLobby)
                .stream()
                .map(user -> {
                    UserLobbyResponseDTO userLobbyResponseDTO = modelMapper.map(user, UserLobbyResponseDTO.class);
                    userLobbyResponseDTO.setReady(readyUsers.contains(userLobbyResponseDTO.getId()));
                    return userLobbyResponseDTO;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<Long> getReadyUsersInLobby(long lobbyId) {
        Set<Long> readyUsersSet = connectionTracker.getReadyUsersByLobbyId(lobbyId);
        return new ArrayList<>(readyUsersSet);
    }

    @Override
    public void changeLobbyUserStatus(long lobbyId, long userId) {
        connectionTracker.changeUserStatus(lobbyId, userId);
        Set<Long> readyUsers = connectionTracker.getReadyUsersByLobbyId(lobbyId);

        if (readyUsers.size() > 1) {
            Iterator<Long> iterator = readyUsers.iterator();

            long playerOneId = iterator.next();
            long playerTwoId = iterator.next();

            System.out.println("READY FOR GAME " + playerOneId + "vs" + playerTwoId);

            // TODO call start a game service
        }
    }
}

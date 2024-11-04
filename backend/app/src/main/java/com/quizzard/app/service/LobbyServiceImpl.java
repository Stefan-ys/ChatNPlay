package com.quizzard.app.service;

import com.quizzard.app.domain.dto.response.LobbyResponseDTO;
import com.quizzard.app.domain.dto.response.UserResponseDTO;
import com.quizzard.app.domain.entity.Lobby;
import com.quizzard.app.domain.entity.User;
import com.quizzard.app.repository.LobbyRepository;
import com.quizzard.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class LobbyServiceImpl implements LobbyService {

    private final LobbyRepository lobbyRepository;
    private final UserRepository userRepository;
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

        return mapToLobbyDTO(lobby);
    }

    @Override
    public LobbyResponseDTO addUserToLobby(Long lobbyId, Long userId) {
        Lobby lobby = lobbyRepository.findById(lobbyId)
                .orElseThrow(() -> new IllegalArgumentException("Lobby not found with id: " + lobbyId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        lobby.getUsers().add(user);
        lobbyRepository.save(lobby);

        return mapToLobbyDTO(lobby);
    }

    @Override
    public LobbyResponseDTO removeUserFromLobby(Long lobbyId, Long userId) {
        Lobby lobby = lobbyRepository.findById(lobbyId)
                .orElseThrow(() -> new IllegalArgumentException("Lobby not found with id: " + lobbyId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        lobby.getUsers().remove(user);
        lobbyRepository.save(lobby);

        return mapToLobbyDTO(lobby);
    }


    @Override
    public LobbyResponseDTO getLobbyById(Long id) {
        Lobby lobby = lobbyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Lobby not found with id: " + id));

        return mapToLobbyDTO(lobby);
    }

    private LobbyResponseDTO mapToLobbyDTO(Lobby lobby) {
        LobbyResponseDTO lobbyResponseDTO = modelMapper.map(lobby, LobbyResponseDTO.class);

        lobbyResponseDTO.setUsers(
                lobby.getUsers().stream()
                        .map(this::mapToUserResponseDTO)
                        .collect(Collectors.toList())
        );

        return lobbyResponseDTO;
    }

    private UserResponseDTO mapToUserResponseDTO(User user) {
        return modelMapper.map(user, UserResponseDTO.class);
    }
}

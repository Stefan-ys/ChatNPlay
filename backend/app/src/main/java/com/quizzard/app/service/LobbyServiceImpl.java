package com.quizzard.app.service;

import com.quizzard.app.dto.response.CommentResponseDTO;
import com.quizzard.app.dto.response.LobbyResponseDTO;
import com.quizzard.app.dto.response.UserResponseDTO;
import com.quizzard.app.entity.Comment;
import com.quizzard.app.entity.Lobby;
import com.quizzard.app.entity.User;
import com.quizzard.app.repository.LobbyRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;


@Service
public class LobbyServiceImpl implements LobbyService {

    @Autowired
    private LobbyRepository lobbyRepository;

    @Autowired
    private ModelMapper modelMapper;


    @Override
    public LobbyResponseDTO createLobby() {
        Lobby lobby = new Lobby();
        return modelMapper.map(lobbyRepository.save(lobby), LobbyResponseDTO.class);
    }

    @Override
    public LobbyResponseDTO addCommentToLobby(Long lobbyId, CommentResponseDTO savedComment) {
        Lobby lobby = lobbyRepository.findById(lobbyId)
                .orElseThrow(() -> new IllegalArgumentException("Lobby not found with id: " + lobbyId));

        Comment comment = modelMapper.map(savedComment, Comment.class);

        lobby.getChat().add(comment);

        lobbyRepository.save(lobby);

        return modelMapper.map(lobby, LobbyResponseDTO.class);
    }

    @Override
    public LobbyResponseDTO getLobbyById(Long id) {
        Lobby lobby = lobbyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Lobby not found with id: " + id));

        return mapToLobbyDTO(lobby);
    }

    private LobbyResponseDTO mapToLobbyDTO(Lobby lobby) {
        LobbyResponseDTO lobbyResponseDTO = modelMapper.map(lobby, LobbyResponseDTO.class);

        lobbyResponseDTO.setChat(
                lobby.getChat().stream()
                        .map(comment -> modelMapper.map(comment, CommentResponseDTO.class))
                        .collect(Collectors.toList())
        );

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

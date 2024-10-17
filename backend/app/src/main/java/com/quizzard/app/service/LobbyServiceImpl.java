package com.quizzard.app.service;

import com.quizzard.app.dto.response.ChatResponseDTO;
import com.quizzard.app.dto.response.CommentResponseDTO;
import com.quizzard.app.dto.response.LobbyResponseDTO;
import com.quizzard.app.dto.response.UserResponseDTO;
import com.quizzard.app.entity.Chat;
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
    public LobbyResponseDTO getLobbyById(Long id) {
        Lobby lobby = lobbyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Lobby not found with id: " + id));

        return mapToLobbyDTO(lobby);
    }

    private LobbyResponseDTO mapToLobbyDTO(Lobby lobby) {
        LobbyResponseDTO lobbyResponseDTO = modelMapper.map(lobby, LobbyResponseDTO.class);
        lobbyResponseDTO.setChat(mapToChatDTO(lobby.getChat()));

        lobbyResponseDTO.setUsers(
                lobby.getUsers().stream()
                        .map(this::mapToUserResponseDTO)
                        .collect(Collectors.toList())
        );

        return lobbyResponseDTO;
    }

    private ChatResponseDTO mapToChatDTO(Chat chat) {
        ChatResponseDTO chatDTO = modelMapper.map(chat, ChatResponseDTO.class);

        chatDTO.setComments(
                chat.getComments().stream()
                        .map(this::mapToCommentDTO)
                        .collect(Collectors.toList())
        );

        return chatDTO;
    }

    private UserResponseDTO mapToUserResponseDTO(User user) {
        return modelMapper.map(user, UserResponseDTO.class);
    }

    private CommentResponseDTO mapToCommentDTO(Comment comment) {
        return modelMapper.map(comment, CommentResponseDTO.class);
    }
}

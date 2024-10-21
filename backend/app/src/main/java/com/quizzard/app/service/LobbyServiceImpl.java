package com.quizzard.app.service;

import com.quizzard.app.dto.response.CommentResponseDTO;
import com.quizzard.app.dto.response.LobbyResponseDTO;
import com.quizzard.app.dto.response.UserResponseDTO;
import com.quizzard.app.entity.Comment;
import com.quizzard.app.entity.Lobby;
import com.quizzard.app.entity.User;
import com.quizzard.app.repository.LobbyRepository;
import com.quizzard.app.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;


@Service
public class LobbyServiceImpl implements LobbyService {

    @Autowired
    private LobbyRepository lobbyRepository;

    @Autowired
    private UserRepository userRepository;

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
    public LobbyResponseDTO removeCommentFromLobby(Long lobbyId, Long commentId) {
        Lobby lobby = lobbyRepository.findById(lobbyId)
                .orElseThrow(() -> new IllegalArgumentException("Lobby not found with id: " + lobbyId));

        lobby.getChat().removeIf(comment -> comment.getId().equals(commentId));

        lobbyRepository.save(lobby);

        return mapToLobbyDTO(lobby);
    }

    @Override
    public LobbyResponseDTO updateCommentInLobby(Long lobbyId, CommentResponseDTO updatedComment) {
        Lobby lobby = lobbyRepository.findById(lobbyId)
                .orElseThrow(() -> new IllegalArgumentException("Lobby not found with id: " + lobbyId));

        lobby.getChat().stream()
                .filter(comment -> comment.getId().equals(updatedComment.getId()))
                .forEach(comment -> comment.setContent(updatedComment.getContent()));

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

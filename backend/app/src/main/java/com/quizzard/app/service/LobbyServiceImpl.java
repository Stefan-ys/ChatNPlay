package com.quizzard.app.service;

import com.google.cloud.storage.Bucket;
import com.google.firebase.cloud.StorageClient;
import com.quizzard.app.domain.dto.response.LobbyResponseDTO;
import com.quizzard.app.domain.entity.Lobby;
import com.quizzard.app.exception.InvalidFileTypeException;
import com.quizzard.app.repository.LobbyRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class LobbyServiceImpl implements LobbyService {

    private final LobbyRepository lobbyRepository;
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
    public LobbyResponseDTO getLobbyById(Long id) {
        Lobby lobby = lobbyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Lobby not found with id: " + id));

        return modelMapper.map(lobby, LobbyResponseDTO.class);
    }
}

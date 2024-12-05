package com.quizzard.app.controller;

import com.quizzard.app.domain.dto.response.LobbyResponseDTO;
import com.quizzard.app.domain.dto.response.UserLobbyResponseDTO;
import com.quizzard.app.service.LobbyService;
import com.quizzard.app.service.QuizMazeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lobbies")
@RequiredArgsConstructor
public class LobbyController {

    private final LobbyService lobbyService;
    private final QuizMazeService quizMazeService;

    @GetMapping("/{lobbyId}")
    public ResponseEntity<LobbyResponseDTO> getLobby(@PathVariable Long lobbyId) {
        LobbyResponseDTO lobby = lobbyService.getLobbyById(lobbyId);
        return ResponseEntity.ok(lobby);
    }

    @GetMapping("/name/{lobbyName}")
    public ResponseEntity<LobbyResponseDTO> getLobbyByName(@PathVariable String lobbyName) {
        LobbyResponseDTO lobby = lobbyService.getLobbyByName(lobbyName);
        return ResponseEntity.ok(lobby);
    }

    @MessageMapping("/lobby/{lobbyId}/addUser")
    @SendTo("/topic/lobby/{lobbyId}")
    public List<UserLobbyResponseDTO> addUserToLobby(
            @DestinationVariable Long lobbyId,
            @Payload Long userId) {
        lobbyService.addLobbyUser(lobbyId, userId);
        return lobbyService.getUsersInLobby(lobbyId);
    }

    @MessageMapping("/lobby/{lobbyId}/removeUser")
    @SendTo("/topic/lobby/{lobbyId}")
    public List<UserLobbyResponseDTO> removeUserFromLobby(
            @DestinationVariable Long lobbyId,
            @Payload Long userId) {
        lobbyService.removeLobbyUser(lobbyId, userId);
        return lobbyService.getUsersInLobby(lobbyId);
    }

    @MessageMapping("/lobby/{lobbyId}/changeStatus")
    @SendTo("/topic/lobby/{lobbyId}")
    public List<UserLobbyResponseDTO> changeUserStatus(
            @DestinationVariable Long lobbyId,
            @Payload Long userId) {
        lobbyService.changeLobbyUserStatus(lobbyId, userId);
        List<Long> readyUsers = lobbyService.getReadyUsersInLobby(lobbyId);
        if(readyUsers.size() > 1){
            String gameId = quizMazeService.startNewGame(readyUsers.get(0),readyUsers.get(1));
        }
        return lobbyService.getUsersInLobby(lobbyId);
    }
}

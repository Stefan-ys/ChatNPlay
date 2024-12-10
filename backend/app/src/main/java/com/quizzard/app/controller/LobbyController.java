package com.quizzard.app.controller;

import com.quizzard.app.domain.dto.response.LobbyResponseDTO;
import com.quizzard.app.domain.dto.response.UserLobbyResponseDTO;
import com.quizzard.app.domain.enums.ResponseTypeEnum;
import com.quizzard.app.security.CustomPrincipal;
import com.quizzard.app.service.LobbyService;
import com.quizzard.app.service.QuizMazeService;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

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
    public Pair<ResponseTypeEnum, List<UserLobbyResponseDTO>> addUserToLobby(
            @DestinationVariable Long lobbyId,
            @Payload Long userId) {
        lobbyService.addLobbyUser(lobbyId, userId);
        List<UserLobbyResponseDTO> usersInLobby = lobbyService.getUsersInLobby(lobbyId);
        return Pair.of(ResponseTypeEnum.USERS_UPDATE, usersInLobby);
    }

    @MessageMapping("/lobby/{lobbyId}/removeUser")
    @SendTo("/topic/lobby/{lobbyId}")
    public Pair<ResponseTypeEnum, List<UserLobbyResponseDTO>> removeUserFromLobby(
            @DestinationVariable Long lobbyId,
            @Payload Long userId) {
        lobbyService.removeLobbyUser(lobbyId, userId);
        List<UserLobbyResponseDTO> usersInLobby = lobbyService.getUsersInLobby(lobbyId);
        return Pair.of(ResponseTypeEnum.USERS_UPDATE, usersInLobby);
    }

    @MessageMapping("/lobby/{lobbyId}/changeStatus")
    @SendTo("/topic/lobby/{lobbyId}")
    public Pair<ResponseTypeEnum, Object> changeUserStatus(
            @DestinationVariable Long lobbyId,
            @Payload Long userId,
            SimpMessageHeaderAccessor headerAccessor) {

        lobbyService.changeLobbyUserStatus(lobbyId, userId);

        List<UserLobbyResponseDTO> usersInLobby = lobbyService.getUsersInLobby(lobbyId);
        List<Long> readyUsers = lobbyService.getReadyUsersInLobby(lobbyId);

        if (readyUsers.size() > 1) {
            long player1Id = readyUsers.get(0);
            long player2Id = readyUsers.get(1);
            String gameId = quizMazeService.startNewGame(player1Id, player2Id);

            Principal principal = headerAccessor.getUser();
            if (principal instanceof CustomPrincipal customPrincipal) {
                long currentUserId = customPrincipal.getId();

                if (currentUserId == player1Id || currentUserId == player2Id) {
                    return Pair.of(ResponseTypeEnum.GAME_START, Map.of("gameId", gameId, "usersInLobby", usersInLobby));
                }
            }
        }
        return Pair.of(ResponseTypeEnum.USERS_UPDATE, usersInLobby);
    }
}

package com.quizzard.app.controller;

import com.quizzard.app.domain.dto.response.LobbyResponseDTO;
import com.quizzard.app.domain.dto.response.UserLobbyResponseDTO;
import com.quizzard.app.service.LobbyService;
import com.quizzard.app.service.UserService;
import com.quizzard.app.tracker.ChannelConnectionTracker;
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
    private final UserService userService;
    private final ChannelConnectionTracker connectionTracker;

    @GetMapping("/{lobbyId}")
    public ResponseEntity<LobbyResponseDTO> getLobby(@PathVariable Long lobbyId) {
        LobbyResponseDTO lobby = lobbyService.getLobbyById(lobbyId); // Exception handled globally
        return ResponseEntity.ok(lobby);
    }

    @GetMapping("/name/{lobbyName}")
    public ResponseEntity<LobbyResponseDTO> getLobbyByName(@PathVariable String lobbyName) {
        LobbyResponseDTO lobby = lobbyService.getLobbyByName(lobbyName); // Exception handled globally
        return ResponseEntity.ok(lobby);
    }

    @MessageMapping("/lobby/{lobbyId}/addUser")
    @SendTo("/topic/lobby/{lobbyId}")
    public List<UserLobbyResponseDTO> addUserToLobby(
            @DestinationVariable Long lobbyId,
            @Payload Long userId) {
        connectionTracker.addUserToLobby(lobbyId, userId);
        return userService.getLobbyUsersByIds(connectionTracker.getUsersInLobby(lobbyId));
    }

    @MessageMapping("/lobby/{lobbyId}/removeUser")
    @SendTo("/topic/lobby/{lobbyId}")
    public List<UserLobbyResponseDTO> removeUserFromLobby(
            @DestinationVariable Long lobbyId,
            @Payload Long userId) {
        connectionTracker.removeUserFromLobby(lobbyId, userId);
        return userService.getLobbyUsersByIds(connectionTracker.getUsersInLobby(lobbyId));
    }

    @MessageMapping("/lobby/{lobbyId}/changeStatus")
    @SendTo("/topic/lobby/{lobbyId}")
    public List<UserLobbyResponseDTO> changeUserStatus(
            @DestinationVariable Long lobbyId,
            @Payload Long userId) {
        connectionTracker.changeUserStatus(lobbyId, userId);
        List<UserLobbyResponseDTO> userLobbyResponseDTOList =  userService.getLobbyUsersByIds(connectionTracker.getUsersInLobby(lobbyId));
        List<UserLobbyResponseDTO> readyUser = userLobbyResponseDTOList.stream().filter(UserLobbyResponseDTO::isReady).toList();
        if(readyUser.size() > 1){
            Long player1Id = readyUser.get(0).getId();
            Long player2Id = readyUser.get(1).getId();
            // TODO call start a game service
        }

        return userLobbyResponseDTOList;
    }
}

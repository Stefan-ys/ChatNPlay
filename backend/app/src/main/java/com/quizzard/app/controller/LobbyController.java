package com.quizzard.app.controller;


import com.quizzard.app.dto.request.CommentRequestDTO;
import com.quizzard.app.dto.response.CommentResponseDTO;
import com.quizzard.app.dto.response.LobbyResponseDTO;
import com.quizzard.app.service.CommentService;
import com.quizzard.app.service.LobbyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/lobbies")
public class LobbyController {

    @Autowired
    private LobbyService lobbyService;

    @Autowired
    private CommentService commentService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @GetMapping("/{lobbyId}")
    public LobbyResponseDTO getLobby(@PathVariable Long lobbyId) {
        return lobbyService.getLobbyById(lobbyId);
    }

    @GetMapping("/name/{lobbyName}")
    public LobbyResponseDTO getLobbyByName(@PathVariable String lobbyName) {
        return lobbyService.getLobbyByName(lobbyName);
    }

    @MessageMapping("/lobby/{lobbyId}/comment")  // Client sends message here
    @SendTo("/topic/lobby/{lobbyId}/chat")       // Broadcast to subscribers on this topic
    public CommentResponseDTO postComment(@PathVariable Long lobbyId, CommentRequestDTO commentRequestDTO) {
        // Create the comment and update the lobby
        CommentResponseDTO createdComment = commentService.createComment(commentRequestDTO);
        lobbyService.addCommentToLobby(lobbyId, createdComment);

        // Return the created comment (this will be sent to the "/topic/lobby/{lobbyId}/chat" topic)
        return createdComment;
    }

    @PutMapping("/{lobbyId}/comments/{commentId}")
    public LobbyResponseDTO editComment(@PathVariable Long lobbyId, @PathVariable Long commentId,
                                        @RequestBody CommentRequestDTO commentRequestDTO) {
        CommentResponseDTO updatedComment = commentService.updateComment(commentId, commentRequestDTO);
        LobbyResponseDTO lobbyResponse = lobbyService.updateCommentInLobby(lobbyId, updatedComment);

//        messagingTemplate.convertAndSend("/topic/lobby/" + lobbyId + "/chat", updatedComment);

        return lobbyResponse;
    }

    @DeleteMapping("/{lobbyId}/comments/{commentId}")
    public LobbyResponseDTO deleteComment(@PathVariable Long lobbyId, @PathVariable Long commentId) {
        commentService.deleteComment(commentId);
        LobbyResponseDTO lobbyResponse = lobbyService.removeCommentFromLobby(lobbyId, commentId);

//        messagingTemplate.convertAndSend("/topic/lobby/" + lobbyId + "/chat", "Comment with ID " + commentId + " was deleted.");

        return lobbyResponse;
    }

    @PostMapping("/{lobbyId}/users/{userId}")
    public LobbyResponseDTO addUserToLobby(@PathVariable Long lobbyId, @PathVariable Long userId) {
        return lobbyService.addUserToLobby(lobbyId, userId);
    }

    @DeleteMapping("/{lobbyId}/users/{userId}")
    public LobbyResponseDTO removeUserFromLobby(@PathVariable Long lobbyId, @PathVariable Long userId) {
        return lobbyService.removeUserFromLobby(lobbyId, userId);
    }
}

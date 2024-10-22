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

    @MessageMapping("/lobby/{lobbyId}/comment")
    @SendTo("/topic/lobby/{lobbyId}/chat")
    public CommentResponseDTO postComment(@PathVariable Long lobbyId, CommentRequestDTO commentRequestDTO) {
        CommentResponseDTO createdComment = commentService.createComment(commentRequestDTO);
        lobbyService.addCommentToLobby(lobbyId, createdComment);

        return createdComment;
    }

    @MessageMapping("/lobby/{lobbyId}/editComment")
    @SendTo("/topic/lobby/{lobbyId}/chat")
    public CommentResponseDTO editComment(@PathVariable Long lobbyId, @PathVariable Long commentId,
                                        @RequestBody CommentRequestDTO commentRequestDTO) {
        CommentResponseDTO updatedComment = commentService.updateComment(commentId, commentRequestDTO);
        lobbyService.updateCommentInLobby(lobbyId, updatedComment);

        return updatedComment;
    }

    @MessageMapping("/lobby/{lobbyId}/deleteComment")
    @SendTo("/topic/lobby/{lobbyId}/chat")
    public Long deleteComment(@PathVariable Long lobbyId, @PathVariable Long commentId) {
        commentService.deleteComment(commentId);
        lobbyService.removeCommentFromLobby(lobbyId, commentId);

        return commentId;
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

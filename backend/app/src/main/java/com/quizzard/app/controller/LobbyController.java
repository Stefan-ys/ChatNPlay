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
@CrossOrigin(origins = "http://localhost:5173")
public class LobbyController {

    @Autowired
    private LobbyService lobbyService;

    @Autowired
    private CommentService commentService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @GetMapping("/{lobbyId}")
    public LobbyResponseDTO getLobby(@PathVariable Long lobbyId) {
        LobbyResponseDTO lobby = lobbyService.getLobbyById(lobbyId);

        messagingTemplate.convertAndSend("/lobby/" + lobbyId, lobby);

        return lobby;
    }

    @MessageMapping("/lobbies/{lobbyId}/comments")
    public CommentResponseDTO postComment(@PathVariable Long lobbyId, @RequestBody CommentRequestDTO commentRequestDTO) {
        CommentResponseDTO createdComment = commentService.createComment(commentRequestDTO);
        lobbyService.addCommentToLobby(lobbyId, createdComment);

        messagingTemplate.convertAndSend("/lobby/" + lobbyId + "/comments", createdComment);
        return createdComment;
    }
}

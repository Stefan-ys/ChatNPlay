package com.quizzard.app.controller;

import com.quizzard.app.domain.dto.request.CommentRequestDTO;
import com.quizzard.app.domain.dto.response.ChatResponseDTO;
import com.quizzard.app.domain.dto.response.CommentResponseDTO;
import com.quizzard.app.security.CustomPrincipal;
import com.quizzard.app.service.ChatService;
import com.quizzard.app.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;


@RestController
@RequestMapping("/api/chats")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final CommentService commentService;


    @GetMapping("/{chatId}")
    public ResponseEntity<ChatResponseDTO> getChat(@PathVariable Long chatId) {
        ChatResponseDTO chatResponseDTO = chatService.getChatById(chatId);
        return ResponseEntity.ok(chatResponseDTO);
    }

    @MessageMapping("/chat/{chatId}/comment")
    @SendTo("/topic/chat/{chatId}")
    public CommentResponseDTO postComment(@Payload CommentRequestDTO commentRequestDTO) {
        return commentService.createComment(commentRequestDTO);
    }

    @MessageMapping("/chat/{chatId}/edit-comment")
    @SendTo("/topic/chat/{chatId}")
    public CommentResponseDTO editComment(@Payload CommentRequestDTO commentRequestDTO,
                                          SimpMessageHeaderAccessor headerAccessor) {
        Principal principal = headerAccessor.getUser();
        verifyUserIsAuthor(principal, commentRequestDTO.getUserId());

        return commentService.updateComment(commentRequestDTO);
    }

    @MessageMapping("/chat/{chatId}/delete-comment")
    @SendTo("/topic/chat/{chatId}")
    public CommentResponseDTO deleteComment(@Payload CommentRequestDTO commentRequestDTO,
                                            SimpMessageHeaderAccessor headerAccessor) {
        Principal principal = headerAccessor.getUser();
        verifyUserIsAuthor(principal, commentRequestDTO.getUserId());

        return commentService.deleteComment(commentRequestDTO.getId());
    }

    private void verifyUserIsAuthor(Principal principal, Long requestUserId) {
        if (principal instanceof CustomPrincipal customPrincipal) {
            if (!customPrincipal.getId().equals(requestUserId)) {
                throw new AccessDeniedException("Not authorized to perform this action.");
            }
        } else {
            throw new AccessDeniedException("User is not authenticated.");
        }
    }
}

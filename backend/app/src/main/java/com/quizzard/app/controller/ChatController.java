package com.quizzard.app.controller;

import com.quizzard.app.dto.request.CommentRequestDTO;
import com.quizzard.app.dto.response.ChatResponseDTO;
import com.quizzard.app.dto.response.CommentResponseDTO;
import com.quizzard.app.entity.Comment;
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
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.security.Principal;

@Controller
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
        Comment createdComment = commentService.createComment(commentRequestDTO);

        return chatService.addComment(commentRequestDTO.getChatId(), createdComment);
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
    public Long deleteComment(@Payload CommentRequestDTO commentRequestDTO,
                              SimpMessageHeaderAccessor headerAccessor) {
        Principal principal = headerAccessor.getUser();
        verifyUserIsAuthor(principal, commentRequestDTO.getUserId());

        commentService.deleteComment(commentRequestDTO.getId());
        return commentRequestDTO.getId();
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

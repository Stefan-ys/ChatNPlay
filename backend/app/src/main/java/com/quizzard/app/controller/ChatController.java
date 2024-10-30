package com.quizzard.app.controller;

import com.quizzard.app.dto.request.CommentRequestDTO;
import com.quizzard.app.dto.response.ChatResponseDTO;
import com.quizzard.app.dto.response.CommentResponseDTO;
import com.quizzard.app.entity.Comment;
import com.quizzard.app.security.CustomUserDetails;
import com.quizzard.app.service.ChatService;
import com.quizzard.app.service.CommentService;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/api/chats")
public class ChatController {

    private final ChatService chatService;
    private final CommentService commentService;

    public ChatController(ChatService chatService, CommentService commentService) {
        this.chatService = chatService;
        this.commentService = commentService;
    }

    @GetMapping("/{chatId}")
    public ResponseEntity<ChatResponseDTO> getChat(@PathVariable Long chatId) {
        ChatResponseDTO chatResponseDTO = chatService.getChatById(chatId);
        return ResponseEntity.ok(chatResponseDTO);
    }

    @MessageMapping("/chat/{chatId}/comment")
    @SendTo("/topic/chat/{chatId}")
    public ResponseEntity<?> postComment(@Payload CommentRequestDTO commentRequestDTO) {
        verifyUserIsAuthor(commentRequestDTO.getUserId());

        Comment createdComment = commentService.createComment(commentRequestDTO);
        CommentResponseDTO response = chatService.addComment(commentRequestDTO.getChatId(), createdComment);
        return ResponseEntity.ok(response);
    }

    @MessageMapping("/chat/{chatId}/edit-comment")
    @SendTo("/topic/chat/{chatId}")
    public ResponseEntity<?> editComment(@Payload CommentRequestDTO commentRequestDTO) {
        verifyUserIsAuthor(commentRequestDTO.getUserId());

        CommentResponseDTO response = commentService.updateComment(commentRequestDTO);
        return ResponseEntity.ok(response);
    }

    @MessageMapping("/chat/{chatId}/delete-comment")
    @SendTo("/topic/chat/{chatId}")
    public ResponseEntity<?> deleteComment(@Payload CommentRequestDTO commentRequestDTO) {
        verifyUserIsAuthor(commentRequestDTO.getUserId());

        commentService.deleteComment(commentRequestDTO.getId());
        return ResponseEntity.ok(commentRequestDTO.getId());
    }

    private void verifyUserIsAuthor(Long requestUserId) {
//        CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//        if (userDetails == null || !userDetails.getId().equals(requestUserId)) {
//            throw new AccessDeniedException("Not authorized to perform this action.");
//        }
    }
}

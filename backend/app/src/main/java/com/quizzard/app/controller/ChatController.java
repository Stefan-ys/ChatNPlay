package com.quizzard.app.controller;

import com.quizzard.app.dto.request.CommentRequestDTO;
import com.quizzard.app.dto.response.ChatResponseDTO;
import com.quizzard.app.dto.response.CommentResponseDTO;
import com.quizzard.app.entity.Comment;
import com.quizzard.app.service.ChatService;
import com.quizzard.app.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/api/chats")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private CommentService commentService;

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
    public CommentResponseDTO editComment(@Payload CommentRequestDTO commentRequestDTO) {
        return commentService.updateComment(commentRequestDTO);
    }

    @MessageMapping("/chat/{chatId}/delete-comment")
    @SendTo("/topic/chat/{chatId}")
    public Long deleteComment(@Payload Long commentId) {
        commentService.deleteComment(commentId);
        return commentId;
    }
}

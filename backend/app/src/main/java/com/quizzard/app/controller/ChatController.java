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
        ChatResponseDTO chat = chatService.getChatById(chatId);
        return ResponseEntity.ok(chat);
    }

    @MessageMapping("/chat/{chatId}/comment")
    @SendTo("/topic/chat/{chatId}")
    public CommentResponseDTO postComment(@PathVariable Long chatId, CommentRequestDTO commentRequestDTO) {
        Comment createdComment = commentService.createComment(commentRequestDTO);
        return chatService.addComment(chatId, createdComment);
    }

    @MessageMapping("/chat/{chatId}/edit-comment")
    @SendTo("/topic/chat/{chatId}")
    public CommentResponseDTO editComment(@PathVariable Long chatId, @PathVariable Long commentId,
                                          CommentRequestDTO commentRequestDTO) {
        return commentService.updateComment(commentId, commentRequestDTO);
    }

    @MessageMapping("/chat/{chatId}/delete-comment")
    @SendTo("/topic/chat/{chatId}")
    public Long deleteComment(@PathVariable Long commentId) {
        commentService.deleteComment(commentId);
        return commentId;
    }
}

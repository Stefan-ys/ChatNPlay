package com.quizzard.app.controller;

import com.quizzard.app.domain.dto.response.CommentResponseDTO;
import com.quizzard.app.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    
    @GetMapping("/{commentId}")
    public ResponseEntity<CommentResponseDTO> getCommentById(@PathVariable Long commentId) {
        CommentResponseDTO comment = commentService.getCommentById(commentId);
        return ResponseEntity.ok(comment);
    }
}

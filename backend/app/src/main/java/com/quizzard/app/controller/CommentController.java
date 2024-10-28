package com.quizzard.app.controller;

import com.quizzard.app.dto.response.CommentResponseDTO;
import com.quizzard.app.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @GetMapping("/{commentId}")
    public ResponseEntity<CommentResponseDTO> getCommentById(@PathVariable Long commentId) {
        CommentResponseDTO comment = commentService.getCommentById(commentId);
        return ResponseEntity.ok(comment);
    }
}

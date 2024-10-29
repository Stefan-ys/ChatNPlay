package com.quizzard.app.service;

import com.quizzard.app.dto.request.CommentRequestDTO;
import com.quizzard.app.dto.response.CommentResponseDTO;
import com.quizzard.app.entity.Comment;

public interface CommentService {

    CommentResponseDTO getCommentById(Long commentId);

    Comment createComment(CommentRequestDTO commentRequestDTO);

    CommentResponseDTO updateComment(CommentRequestDTO commentRequestDTO);

    void deleteComment(Long commentId);
}

package com.quizzard.app.service;

import com.quizzard.app.dto.request.CommentRequestDTO;
import com.quizzard.app.dto.response.CommentResponseDTO;

public interface CommentService {

    CommentResponseDTO getCommentById(Long commentId);

    CommentResponseDTO createComment(CommentRequestDTO commentRequestDTO);

    CommentResponseDTO updateComment(Long commentId, CommentRequestDTO commentRequestDTO);

    void deleteComment(Long commentId);
}

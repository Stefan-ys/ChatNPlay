package com.quizzard.app.service;

import com.quizzard.app.domain.dto.request.CommentRequestDTO;
import com.quizzard.app.domain.dto.response.CommentResponseDTO;

public interface CommentService {

    CommentResponseDTO getCommentById(Long commentId);

    CommentResponseDTO createComment(CommentRequestDTO commentRequestDTO);

    CommentResponseDTO updateComment(CommentRequestDTO commentRequestDTO);

    CommentResponseDTO deleteComment(Long commentId);
}

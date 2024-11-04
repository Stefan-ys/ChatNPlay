package com.quizzard.app.service;

import com.quizzard.app.domain.dto.request.CommentRequestDTO;
import com.quizzard.app.domain.dto.response.CommentResponseDTO;
import com.quizzard.app.domain.entity.Comment;

public interface CommentService {

    CommentResponseDTO getCommentById(Long commentId);

    Comment createComment(CommentRequestDTO commentRequestDTO);

    CommentResponseDTO updateComment(CommentRequestDTO commentRequestDTO);

    void deleteComment(Long commentId);
}

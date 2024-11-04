package com.quizzard.app.service;

import com.quizzard.app.domain.dto.request.CommentRequestDTO;
import com.quizzard.app.domain.dto.response.CommentResponseDTO;
import com.quizzard.app.domain.entity.Comment;
import com.quizzard.app.domain.entity.User;
import com.quizzard.app.repository.CommentRepository;
import com.quizzard.app.repository.LobbyRepository;
import com.quizzard.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final LobbyRepository lobbyRepository;
    private final ModelMapper modelMapper;


    @Override
    public CommentResponseDTO getCommentById(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found with id: " + commentId));

        return modelMapper.map(comment, CommentResponseDTO.class);
    }

    @Override
    public Comment createComment(CommentRequestDTO commentRequestDTO) {
        Comment comment = new Comment();

        User user = userRepository.findById(commentRequestDTO.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + commentRequestDTO.getUserId()));

        comment.setUser(user);

        comment.setContent(commentRequestDTO.getContent());

        return commentRepository.save(comment);
    }

    @Override
    public CommentResponseDTO updateComment(CommentRequestDTO commentRequestDTO) {
        Comment existingComment = commentRepository.findById(commentRequestDTO.getId())
                .orElseThrow(() -> new IllegalArgumentException("Comment not found with id: " + commentRequestDTO.getId()));

        existingComment.setContent(commentRequestDTO.getContent());

        return modelMapper.map(commentRepository.save(existingComment), CommentResponseDTO.class);
    }

    @Override
    public void deleteComment(Long commentId) {
        if (!commentRepository.existsById(commentId)) {
            throw new IllegalArgumentException("Comment not found with id: " + commentId);
        }
        commentRepository.deleteById(commentId);
    }
}

package com.quizzard.app.service;

import com.quizzard.app.dto.request.CommentRequestDTO;
import com.quizzard.app.dto.response.CommentResponseDTO;
import com.quizzard.app.entity.Comment;
import com.quizzard.app.entity.User;
import com.quizzard.app.repository.CommentRepository;
import com.quizzard.app.repository.LobbyRepository;
import com.quizzard.app.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LobbyRepository lobbyRepository;

    @Autowired
    private ModelMapper modelMapper;


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

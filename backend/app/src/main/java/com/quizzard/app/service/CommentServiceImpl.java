package com.quizzard.app.service;

import com.quizzard.app.dto.request.CommentRequestDTO;
import com.quizzard.app.dto.response.CommentResponseDTO;
import com.quizzard.app.entity.Comment;
import com.quizzard.app.entity.User;
import com.quizzard.app.repository.ChatRepository;
import com.quizzard.app.repository.CommentRepository;
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
    private ModelMapper modelMapper;
    @Autowired
    private ChatRepository chatRepository;

    @Override
    public CommentResponseDTO getCommentById(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found with id: " + commentId));
        return modelMapper.map(comment, CommentResponseDTO.class);
    }

    @Override
    public CommentResponseDTO createComment(CommentRequestDTO commentRequestDTO) {
        Comment comment = new Comment();

        User user = userRepository.findById(commentRequestDTO.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + commentRequestDTO.getUserId()));
        comment.setChat(chatRepository.getChatsById(commentRequestDTO.getChatId()));

        comment.setUser(user);

        comment.setContent(commentRequestDTO.getContent());

        Comment savedComment = commentRepository.save(comment);
        return modelMapper.map(savedComment, CommentResponseDTO.class);
    }

    @Override
    public CommentResponseDTO updateComment(Long commentId, CommentRequestDTO commentRequestDTO) {
        Comment existingComment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found with id: " + commentId));

        existingComment.setContent(commentRequestDTO.getContent());

        Comment updatedComment = commentRepository.save(existingComment);
        return modelMapper.map(updatedComment, CommentResponseDTO.class);
    }

    @Override
    public void deleteComment(Long commentId) {
        if (!commentRepository.existsById(commentId)) {
            throw new IllegalArgumentException("Comment not found with id: " + commentId);
        }
        commentRepository.deleteById(commentId);
    }
}

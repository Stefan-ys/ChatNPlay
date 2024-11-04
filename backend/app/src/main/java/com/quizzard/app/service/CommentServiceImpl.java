package com.quizzard.app.service;

import com.quizzard.app.domain.dto.request.CommentRequestDTO;
import com.quizzard.app.domain.dto.response.CommentResponseDTO;
import com.quizzard.app.domain.entity.Chat;
import com.quizzard.app.domain.entity.Comment;
import com.quizzard.app.domain.entity.User;
import com.quizzard.app.domain.enums.OperationType;
import com.quizzard.app.repository.ChatRepository;
import com.quizzard.app.repository.CommentRepository;
import com.quizzard.app.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final ChatRepository chatRepository;


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
        comment.setUser(user);

        Chat chat = chatRepository.findById(commentRequestDTO.getChatId())
                        .orElseThrow(() -> new IllegalArgumentException("Chat not found with id: " + commentRequestDTO.getChatId()));
        comment.setChat(chat);

        comment.setContent(commentRequestDTO.getContent());

        chat.getComments().add(comment);

        chatRepository.save(chat);

        CommentResponseDTO commentResponseDTO = modelMapper.map(comment, CommentResponseDTO.class);
        commentResponseDTO.setType(OperationType.ADD.toString());

        return commentResponseDTO;
    }

    @Override
    public CommentResponseDTO updateComment(CommentRequestDTO commentRequestDTO) {
        Comment existingComment = commentRepository.findById(commentRequestDTO.getId())
                .orElseThrow(() -> new IllegalArgumentException("Comment not found with id: " + commentRequestDTO.getId()));

        existingComment.setContent(commentRequestDTO.getContent());

        CommentResponseDTO commentResponseDTO =  modelMapper.map(commentRepository.save(existingComment), CommentResponseDTO.class);
        commentResponseDTO.setType(OperationType.EDIT.toString());

        return  commentResponseDTO;
    }

    @Override
    @Transactional
    public CommentResponseDTO deleteComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found with id: " + commentId));

        Chat chat = comment.getChat();
        chat.getComments().remove(comment);

        CommentResponseDTO commentResponseDTO = modelMapper.map(comment, CommentResponseDTO.class);
        commentResponseDTO.setType(OperationType.DELETE.toString());

        commentRepository.delete(comment);

        return commentResponseDTO;
    }
}

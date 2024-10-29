package com.quizzard.app.service;

import com.quizzard.app.dto.response.ChatResponseDTO;
import com.quizzard.app.dto.response.CommentResponseDTO;
import com.quizzard.app.dto.response.UserResponseDTO;
import com.quizzard.app.entity.Chat;
import com.quizzard.app.entity.Comment;
import com.quizzard.app.repository.ChatRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class ChatServiceImpl implements ChatService {

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private ModelMapper modelMapper;


    @Override
    public ChatResponseDTO getChatById(Long chatId) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new IllegalArgumentException("Chat not found with id: " + chatId));

        ChatResponseDTO chatResponseDTO = modelMapper.map(chat, ChatResponseDTO.class);

        chatResponseDTO.setComments(chat.getComments()
                .stream()
                .map(comment -> {
                    CommentResponseDTO commentResponseDTO = modelMapper.map(comment, CommentResponseDTO.class);
                    commentResponseDTO.setUser(modelMapper.map(comment.getUser(), UserResponseDTO.class));
                    return commentResponseDTO;
                })
                .collect(Collectors.toList()));

        return chatResponseDTO;
    }

    @Override
    public CommentResponseDTO addComment(Long chatId, Comment comment) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new IllegalArgumentException("Chat not found with id: " + chatId));

        chat.getComments().add(comment);

        chatRepository.save(chat);

        CommentResponseDTO commentResponseDTO =  modelMapper.map(comment, CommentResponseDTO.class);
        commentResponseDTO.setUser(modelMapper.map(comment.getUser(), UserResponseDTO.class));
        return commentResponseDTO;
    }
}

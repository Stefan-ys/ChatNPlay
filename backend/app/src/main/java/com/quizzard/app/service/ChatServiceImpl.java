package com.quizzard.app.service;

import com.quizzard.app.domain.dto.response.ChatResponseDTO;
import com.quizzard.app.domain.dto.response.CommentResponseDTO;
import com.quizzard.app.domain.dto.response.UserResponseDTO;
import com.quizzard.app.domain.entity.Chat;
import com.quizzard.app.domain.entity.Comment;
import com.quizzard.app.repository.ChatRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ChatRepository chatRepository;
    private final ModelMapper modelMapper;


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

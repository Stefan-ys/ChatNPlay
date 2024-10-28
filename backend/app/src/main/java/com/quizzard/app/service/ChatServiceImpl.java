package com.quizzard.app.service;

import com.quizzard.app.dto.response.ChatResponseDTO;
import com.quizzard.app.dto.response.CommentResponseDTO;
import com.quizzard.app.entity.Chat;
import com.quizzard.app.entity.Comment;
import com.quizzard.app.repository.ChatRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ChatServiceImpl implements ChatService {

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private ModelMapper modelMapper;


    @Override
    public ChatResponseDTO getChatById(Long chatId) {
        return null;
    }

    @Override
    public CommentResponseDTO addComment(Long chatId, Comment comment) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new IllegalArgumentException("Chat not found with id: " + chatId));

        chat.getComments().add(comment);

        chatRepository.save(chat);

        return modelMapper.map(chat, CommentResponseDTO.class);
    }
}

package com.quizzard.app.service;

import com.quizzard.app.dto.response.CommentResponseDTO;
import com.quizzard.app.entity.Chat;
import com.quizzard.app.entity.Comment;
import com.quizzard.app.entity.User;
import com.quizzard.app.repository.ChatRepository;
import com.quizzard.app.repository.CommentRepository;
import com.quizzard.app.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;


@Service
public class ChatServiceImpl implements ChatService {

    @Autowired
    private ChatRepository chatRepository;


}

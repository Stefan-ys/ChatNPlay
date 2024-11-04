package com.quizzard.app.service;

import com.quizzard.app.domain.dto.response.ChatResponseDTO;
import com.quizzard.app.domain.dto.response.CommentResponseDTO;
import com.quizzard.app.domain.entity.Comment;

public interface ChatService {

    ChatResponseDTO getChatById(Long chatId);
}

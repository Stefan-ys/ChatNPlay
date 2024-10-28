package com.quizzard.app.service;

import com.quizzard.app.dto.response.ChatResponseDTO;
import com.quizzard.app.dto.response.CommentResponseDTO;
import com.quizzard.app.entity.Comment;

public interface ChatService {

    ChatResponseDTO getChatById(Long chatId);

    CommentResponseDTO addComment(Long chatId, Comment comment);
}

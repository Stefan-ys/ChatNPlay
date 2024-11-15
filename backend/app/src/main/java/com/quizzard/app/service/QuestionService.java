package com.quizzard.app.service;

import com.quizzard.app.domain.dto.request.QuestionRequestDTO;
import com.quizzard.app.domain.dto.response.QuestionResponseDTO;
import jakarta.transaction.Transactional;

import java.io.IOException;
import java.util.List;

public interface QuestionService {
    @Transactional
    void createQuestion(QuestionRequestDTO questionRequestDTO) throws IOException;

    QuestionResponseDTO getQuestionById(long questionId);

    List<QuestionResponseDTO> getQuestionsByTopicId(long topicId);

    @Transactional
    void updateQuestion(Long questionId, QuestionRequestDTO questionRequestDTO);

    void deleteQuestion(long questionId);
}

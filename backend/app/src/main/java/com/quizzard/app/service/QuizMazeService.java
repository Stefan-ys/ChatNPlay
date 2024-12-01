package com.quizzard.app.service;

import com.quizzard.app.domain.dto.request.QuizMazeRequestDTO;
import com.quizzard.app.domain.dto.response.QuestionResponseDTO;
import com.quizzard.app.domain.dto.response.QuizMazeGameResponseDTO;
import com.quizzard.app.domain.dto.response.QuizMazeGameResponseLightDTO;
import com.quizzard.app.domain.enums.TimerEnum;

public interface QuizMazeService {
    QuizMazeGameResponseDTO newGame(long player1Id, long player2Id);

    QuizMazeGameResponseLightDTO updateGame(QuizMazeRequestDTO quizMazeRequestDTO);

    QuestionResponseDTO getRandomQuestion(String gameId);

    void startTimer(String gameId, TimerEnum question);

    void stopTimer(String gameId);

    int checkAnswer(String submittedAnswer);
}

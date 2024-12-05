package com.quizzard.app.service;

import com.quizzard.app.domain.dto.request.QuizMazeRequestDTO;
import com.quizzard.app.domain.dto.response.QuestionResponseDTO;
import com.quizzard.app.domain.dto.response.QuizMazeGameResponseDTO;
import com.quizzard.app.domain.dto.response.QuizMazeGameResponseLightDTO;

public interface QuizMazeService {
    QuizMazeGameResponseDTO newGame(long player1Id, long player2Id);

    QuizMazeGameResponseLightDTO updateGame(QuizMazeRequestDTO quizMazeRequestDTO);

    QuestionResponseDTO getRandomQuestion(String gameId);

    int checkAnswer(String gameId, String submittedAnswer, int timeLeft);

    byte[] markPlayerMove(String gameId, byte x, byte y);

    void questionAnswerCheck(String gameId, String response, byte x, byte y);
}

package com.quizzard.app.domain.dto.response;

public class QuizMazeGameResponseLightDTO {

    private String id;
    private QuizMazePlayerResponseDTO player1;
    private QuizMazePlayerResponseDTO player2;
    private long playerTurnId;
    private byte moves;
    private byte[][] field;
    private byte[] playerPosition;
    private QuestionResponseDTO question;
}

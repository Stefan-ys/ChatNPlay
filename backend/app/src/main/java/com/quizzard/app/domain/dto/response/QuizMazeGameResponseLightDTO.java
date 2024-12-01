package com.quizzard.app.domain.dto.response;

public class QuizMazeGameResponseLightDTO {

    private String id;
    private QuizMazePlayerResponseDTO player1;
    private QuizMazePlayerResponseDTO player2;
    private boolean isPlayer1Turn;
    private byte moves;
    private byte[][] field;
    private byte[] playerPosition;
    private QuestionResponseDTO question;
}

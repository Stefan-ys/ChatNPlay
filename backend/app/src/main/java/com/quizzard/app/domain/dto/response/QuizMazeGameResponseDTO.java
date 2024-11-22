package com.quizzard.app.domain.dto.response;

import com.quizzard.app.domain.model.QuizMazeGame;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizMazeGameResponseDTO {

    private String id;
    private String title = QuizMazeGame.TITLE;
    private String version = QuizMazeGame.VERSION;
    private String DESCRIPTION = QuizMazeGame.DESCRIPTION;
    private String rules = QuizMazeGame.RULES;
    private byte timeToAnswer = QuizMazeGame.TIME_TO_ANSWER;
    private byte totalMovesAllowed = QuizMazeGame.TOTAL_MOVES;
    private byte timeToMove = QuizMazeGame.TIME_TO_MOVE;
    private QuizMazePlayerResponseDTO player1;
    private QuizMazePlayerResponseDTO player2;
    private boolean isPlayer1Turn;
    private byte moves;
    private byte[][] field;
}

package com.quizzard.app.domain.dto.response;

import com.quizzard.app.common.QuizMazeGameConstants;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizMazeGameResponseDTO {

    private String id;
    private String title = QuizMazeGameConstants.TITLE;
    private String version = QuizMazeGameConstants.VERSION;
    private String description = QuizMazeGameConstants.DESCRIPTION;
    private String rules = QuizMazeGameConstants.RULES;
    private byte timeToAnswer = QuizMazeGameConstants.TIME_FOR_ANSWER;
    private byte totalMovesAllowed = QuizMazeGameConstants.TOTAL_MOVES;
    private byte timeToMove = QuizMazeGameConstants.TIME_FOR_MOVE;
    private QuizMazePlayerResponseDTO player1;
    private QuizMazePlayerResponseDTO player2;
    private boolean isPlayer1Turn;
    private byte moves;
    private byte[][] field;
}

package com.quizzard.app.domain.model;


import com.quizzard.app.domain.entity.Question;
import com.quizzard.app.domain.entity.QuizMazeResult;
import com.quizzard.app.domain.enums.GameNameEnum;
import com.quizzard.app.domain.enums.GameResultEnum;
import com.quizzard.app.domain.enums.PerkEnum;
import com.quizzard.app.exception.IllegalMoveException;
import com.quizzard.app.service.UserService;
import lombok.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class QuizMazeGame extends Game {


    public static final GameNameEnum TITLE = GameNameEnum.QUIZ_MAZE;
    public static final String VERSION = "1.0";
    public static final String DESCRIPTION = "todo description";
    public static final String RULES = "todo rules";

    private static final byte FIELD_SCALE = 5;
    private static final byte TOTAL_MOVES = 16;
    private static final byte TIME_TO_ANSWER = 30;
    private static final byte TIMO_TO_MOVE = 60;

    private UserService userService;

    private Player player1;
    private Player player2;
    private boolean isPlayer1Turn = true;
    private byte moves = 0;
    private List<Question> questionList = new ArrayList<>();
    private long currentQuestionIndex;

    private List<PerkEnum> perks = new LinkedList<>(Arrays.asList(
            PerkEnum.CASTLE,
            PerkEnum.FIFTY_FIFTY,
            PerkEnum.FREE_PASS,
            PerkEnum.CASTLE,
            PerkEnum.FIFTY_FIFTY,
            PerkEnum.FREE_PASS
    ));

    /*
        FIELD SYMBOLS
        1 - PLAYER 1
        2 - PLAYER 2
        3 - PERK
        10 - PLAYER 1 CASTLE + 1
        11 - PLAYER 1 CASTLE + 2
        20 - PLAYER 2 CASTLE + 1
        21 - PLAYER 2 CASTLE + 2
        -1 - PLAYER 1 ATTEMPT + 30
        -2 - PLAYER 2 ATTEMPT + 60
    */
    private byte[][] field = new byte[][]{
            {0, 0, 0, 0, 0},
            {0, 10, 3, 3, 0},
            {0, 3, 0, 3, 0},
            {0, 3, 3, 20, 0},
            {0, 0, 0, 0, 0}
    };

    public byte[][] playerAttemptMove(byte x, byte y) {

        if (!isLegalMove((byte) (isPlayer1Turn ? 1 : 2), x, y)) {
            throw new IllegalMoveException((byte) (isPlayer1Turn ? 1 : 2));
        }

        byte[][] fieldCopy = copyField();
        if (isPlayer1Turn) {
            fieldCopy[x][y] = -1;
        } else {
            fieldCopy[x][y] = -2;
        }
        return fieldCopy;
    }

    public byte[][] playerSuccessfulAnswer(byte x, byte y) {
        if (field[x][y] == 10) {
            field[x][y] = 1;
        } else if (field[x][y] == 20) {
            field[x][y] = 2;
        } else if (field[x][y] > 10) {
            field[x][y]--;
        } else {
            if (field[x][y] == 3) {
                PerkEnum perk = getPerk();
                if (isPlayer1Turn) {
                    player1.addPerk(perk);
                } else {
                    player2.addPerk(perk);
                }
            }
            field[x][y] = (byte) (isPlayer1Turn ? 1 : 2);
            addScore();
        }
        return field;
    }

    public void switchPlayers() {
        this.isPlayer1Turn = !isPlayer1Turn;
        this.moves++;
    }


    public QuizMazeResult EndGame() {
        QuizMazeResult result = new QuizMazeResult();

        result.setPlayer1(userService.findById(player1.getId()));
        result.setPlayer2(userService.findById(player2.getId()));
        result.setPlayer1Score(player1.getGameScore());
        result.setPlayer2Score(player2.getGameScore());

        if (player1.getGameScore() > player2.getGameScore()) {
            result.setGameResult(GameResultEnum.PLAYER1_WINS);
        } else if (player2.getGameScore() > player1.getGameScore()) {
            result.setGameResult(GameResultEnum.PLAYER2_WINS);
        } else {
            result.setGameResult(GameResultEnum.DRAW);
        }
        return result;
    }

    private boolean isGameOver() {
        if (moves == TOTAL_MOVES) return true;

        boolean player1HasCells = false;
        boolean player2HasCells = false;

        for (byte[] row : field) {
            for (byte cell : row) {
                if (!player1HasCells && (cell == 1 || (cell >= 10 && cell <= 19))) {
                    player1HasCells = true;
                }
                if (!player2HasCells && (cell == 2 || (cell >= 20 && cell <= 29))) {
                    player2HasCells = true;
                }

                if (player1HasCells && player2HasCells) return false;
            }
        }

        return true;
    }

    private void addScore() {
        if (isPlayer1Turn) {
            player1.setGameScore(player1.getGameScore() + 1);
        } else {
            player2.setGameScore(player2.getGameScore() + 1);
        }
    }

    private PerkEnum getPerk() {
        if (perks.isEmpty()) {
            throw new IllegalStateException("No perks available.");
        }
        int randomIndex = ThreadLocalRandom.current().nextInt(0, perks.size());
        PerkEnum perk = perks.get(randomIndex);
        perks.remove(randomIndex);

        return perk;
    }

    private byte[][] copyField() {
        byte[][] fieldCopy = new byte[FIELD_SCALE][FIELD_SCALE];
        for (int i = 0; i < FIELD_SCALE; i++) {
            System.arraycopy(field[i], 0, fieldCopy[i], 0, FIELD_SCALE);
        }
        return fieldCopy;
    }

    private boolean isLegalMove(byte player, byte x, byte y) {
        if (x < 0 || x >= FIELD_SCALE || y < 0 || y >= FIELD_SCALE) {
            return false;
        }

        final int[][] directions = {
                {-1, -1}, {-1, 0}, {-1, 1}, {0, -1}, {0, 1}, {1, -1}, {1, 0}, {1, 1}
        };

        byte[] validValues = player == 1
                ? new byte[]{1, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19}
                : new byte[]{2, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29};

        for (int[] dir : directions) {
            int nx = x + dir[0];
            int ny = y + dir[1];

            if (nx >= 0 && nx < FIELD_SCALE && ny >= 0 && ny < FIELD_SCALE && isValidCell(field[nx][ny], validValues)) {
                return true;
            }
        }
        return false;
    }

    private boolean isValidCell(byte cell, byte[] validValues) {
        for (byte value : validValues) {
            if (cell == value) return true;
        }
        return false;
    }
}

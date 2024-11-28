package com.quizzard.app.domain.model;

import com.quizzard.app.domain.entity.Question;
import com.quizzard.app.domain.entity.QuizMazeResult;
import com.quizzard.app.domain.entity.User;
import com.quizzard.app.domain.enums.GameResultEnum;
import com.quizzard.app.exception.IllegalMoveException;
import lombok.*;
import org.jetbrains.annotations.Contract;
import org.jetbrains.annotations.NotNull;

import java.util.LinkedList;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ThreadLocalRandom;

@Setter
@Getter
public class QuizMazeGame extends Game {

    public static final String TITLE = "Quiz Maze";
    public static final String VERSION = "1.0";
    public static final String DESCRIPTION = "todo description";
    public static final String RULES = "todo rules";

    public static final byte TIME_FOR_ANSWER = 30;
    public static final byte TOTAL_MOVES = 16;
    public static final byte TIME_FOR_MOVE = 60;
    private static final byte FIELD_SCALE = 5;

    private Player player1;
    private Player player2;
    private boolean isPlayer1Turn;
    private byte moves;

    private Question curentQuestion;

    private byte[][] field;
    private List<Perk> perks;


    public QuizMazeGame(@NotNull Player player1, @NotNull Player player2) {
        super.setId("<*" + QuizMazeGame.TITLE + "*> " + player1.getUsername() + "-vs-" + player2.getUsername());
        this.player1 = player1;
        this.player2 = player2;
        this.isPlayer1Turn = true;
        this.moves = 0;
        this.field = this.initializeField();
        this.perks = this.initializePerks();
    }


    public byte[][] playerAttemptMove(byte x, byte y) {
        if (!isLegalMove((byte) (isPlayer1Turn ? 1 : 2), x, y)) {
            throw new IllegalMoveException((byte) (isPlayer1Turn ? 1 : 2));
        }
        // TODO
        return field;
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
                Perk perk = getPerk();
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

    public QuizMazeResult EndGame(User user1, User user2) {
        QuizMazeResult result = new QuizMazeResult();

        result.setPlayer1(player1.getUsername());
        result.setPlayer2(player2.getUsername());
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

    @NotNull
    @Contract(value = " -> new", pure = true)
    private byte[][] initializeField() {

        return new byte[][]{
                {3, 8, 3, 0},
                {0, 13, 0, 8, 3},
                {3, 0, 8, 0},
                {8, 0, 0, 23, 0},
                {3, 0, 3, 0}
        };
    }

    @NotNull
    private List<Perk> initializePerks() {
        List<Perk> perksList = new LinkedList<>();
        perksList.add(new FiftyFiftyPerk());
        perksList.add(new CastlePerk());
        perksList.add(new FreePassPerk());
        perksList.add(new DragonPerk());
        perksList.add(new CatapultPerk());
        return perksList;
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

    private Perk getPerk() {
        if (perks.isEmpty()) {
            throw new IllegalStateException("No perks available.");
        }
        int randomIndex = ThreadLocalRandom.current().nextInt(0, perks.size());
        return perks.get(randomIndex);
    }

    private boolean isLegalMove(byte player, byte x, byte y) {
        if (x < 0 || x >= field.length || y < 0 || y >= field[x].length) {
            return false;
        }

        final byte[][] directionsEvenRow = {{-1, -1}, {-1, 0}, {0, -1}, {0, 1}, {1, -1}, {1, 0}};
        final byte[][] directionsOddRow = {{-1, 0}, {-1, 1}, {0, -1}, {0, 1}, {1, 0}, {1, 1}};

        Set<Byte> validValues = player == 1
                ? Set.of((byte)1, (byte)10, (byte)11, (byte)12, (byte)13, (byte)14, (byte)15, (byte)16)
                : Set.of((byte)2, (byte)20, (byte)21, (byte)22, (byte)23, (byte)24, (byte)25, (byte)26);

        if (x % 2 == 0) {
            for (byte[] dir : directionsEvenRow) {
                int nx = x + dir[0];
                int ny = y + dir[1];

                if (nx >= 0 && nx < field.length && ny >= 0 && ny < field[nx].length && validValues.contains(field[nx][ny])) {
                    return true;
                }
            }
        } else {
            for (byte[] dir : directionsOddRow) {
                int nx = x + dir[0];
                int ny = y + dir[1];

                if (nx >= 0 && nx < FIELD_SCALE && ny >= 0 && ny < FIELD_SCALE && validValues.contains(field[nx][ny])) {
                    return true;
                }
            }
        }

        return false;
    }
}

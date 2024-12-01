package com.quizzard.app.common;

public class QuizMazeGameConstants {

    public static final String TITLE = "Quiz Maze";
    public static final String VERSION = "1.0";
    public static final String DESCRIPTION = "todo description";
    public static final String RULES = "todo rules";
    public static final byte TIME_FOR_ANSWER = 30;
    public static final byte TOTAL_MOVES = 16;
    public static final byte TIME_FOR_MOVE = 60;
    public static final byte FIELD_SCALE = 5;

    /*
        FIELD LEGEND
        1 - PLAYER1
        2 - PLAYER2
        3 - PERK
        8 - IMPASSABLE OBJECT
        10 - PLAYER1 CASTLE DESTROYED
        11-16 - PLAYER1 CASTLE NUMBER DEFINES HEALTH POINTS
        20 - PLAYER 2 CASTLE DESTROYED
        21-26 - PLAYER2 CASTLE NUMBER DEFINES HEALTH POINTS
    */

    public static final byte[][][] GAME_BOARDS_2_PLAYERS = new byte[][][]{
            {
                    {3, 8, 3, 0},
                    {0, 13, 0, 8, 3},
                    {3, 0, 8, 0},
                    {8, 0, 0, 23, 0},
                    {3, 0, 3, 0}
            },
            {
                    {3, 0, 3, 3},
                    {8, 13, 0, 8, 3},
                    {3, 0, 8, 3},
                    {0, 8, 0, 23, 0},
                    {3, 0, 3, 8}
            }
    };
}
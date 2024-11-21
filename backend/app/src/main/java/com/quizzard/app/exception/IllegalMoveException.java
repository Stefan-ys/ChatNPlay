package com.quizzard.app.exception;

public class IllegalMoveException extends RuntimeException {
    public IllegalMoveException(byte player) {
        super("Illegal move from player " + player);
    }
}

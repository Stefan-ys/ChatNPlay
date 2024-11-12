package com.quizzard.app.common;

public class Constraints {

    public static final int USERNAME_MIN_LENGTH = 4;
    public static final int USERNAME_MAX_LENGTH = 20;
    public static final String USERNAME_LENGTH_MESSAGE =
            "Username must be between " + USERNAME_MIN_LENGTH + " and " + USERNAME_MAX_LENGTH;

    public static final int PASSWORD_MIN_LENGTH = 4;
    public static final int PASSWORD_MAX_LENGTH = 24;
    public static final String PASSWORD_LENGTH_MESSAGE =
            "Password must be between " + PASSWORD_MIN_LENGTH + " and " + PASSWORD_MAX_LENGTH;
}

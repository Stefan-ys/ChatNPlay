package com.quizzard.app.service;


public interface GameTimerService {
    void startTimer(String gameId, int duration, int interval, Runnable onTick);

    int stopTimer(String gameId);

    int getTimeLeft(String gameId);
}

package com.quizzard.app.service;

import org.springframework.stereotype.Service;

import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class GameTimerServiceImpl implements GameTimerService {

    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(5); // Pool for multiple timers
    private final ConcurrentHashMap<String, ScheduledFuture<?>> timers = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, AtomicInteger> timeLeftMap = new ConcurrentHashMap<>();

    @Override
    public void startTimer(String gameId, int duration, int interval, Runnable onTick) {
        AtomicInteger timeLeft = new AtomicInteger(duration);
        timeLeftMap.put(gameId, timeLeft);

        ScheduledFuture<?> future = scheduler.scheduleAtFixedRate(() -> {
            int remainingTime = timeLeft.decrementAndGet();
            if (remainingTime >= 0) {
                onTick.run();
            } else {
                stopTimer(gameId);
            }
        }, 0, interval, TimeUnit.SECONDS);

        timers.put(gameId, future);
    }

    @Override
    public int stopTimer(String gameId) {
        ScheduledFuture<?> future = timers.remove(gameId);
        if (future != null) {
            future.cancel(true);
        }
        AtomicInteger timeLeft = timeLeftMap.remove(gameId);
        return timeLeft != null ? timeLeft.get() : -1;
    }

    @Override
    public int getTimeLeft(String gameId) {
        AtomicInteger timeLeft = timeLeftMap.get(gameId);
        return timeLeft != null ? timeLeft.get() : -1;
    }

}

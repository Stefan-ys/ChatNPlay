package com.quizzard.app.tracker;

import com.quizzard.app.domain.model.Game;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Data
@Component
@RequiredArgsConstructor
public class GameTracker {
    private final Map<String, Game> activeGames = new ConcurrentHashMap<>();

    public void createGame(Game game) {
        activeGames.put(game.getId(), game);
    }

    public Game getGame(String gameId) {
        return activeGames.get(gameId);
    }

    public void removeGame(String gameId) {
        activeGames.remove(gameId);
    }
}

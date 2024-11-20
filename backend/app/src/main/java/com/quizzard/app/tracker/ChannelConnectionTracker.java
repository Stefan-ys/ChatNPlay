package com.quizzard.app.tracker;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.*;


@Component
@RequiredArgsConstructor
public class ChannelConnectionTracker {

    private final Map<Long, Map<Long, Boolean>> lobbyConnections = new HashMap<>();


    public void addUserToLobby(long lobbyId, long userId) {
        lobbyConnections.putIfAbsent(lobbyId, new LinkedHashMap<>());
        lobbyConnections.get(lobbyId).put(userId, false);
    }

    public void removeUserFromLobby(long lobbyId, long userId) {
        Map<Long, Boolean> users = lobbyConnections.get(lobbyId);
        if (users != null) {
            users.remove(userId);
            if (users.isEmpty()) {
                lobbyConnections.remove(lobbyId);
            }
        }
    }

    public void changeUserStatus(long lobbyId, long userId) {
        lobbyConnections.get(lobbyId).put(userId, !lobbyConnections.get(lobbyId).get(userId));
    }

    public Map<Long, Boolean> getUsersInLobby(long lobbyId) {
        return lobbyConnections.getOrDefault(lobbyId, new LinkedHashMap<>());
    }
}

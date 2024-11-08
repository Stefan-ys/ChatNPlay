package com.quizzard.app.tracker;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.*;


@Component
@RequiredArgsConstructor
public class ChannelConnectionTracker {

    private final Map<Long, Set<Long>> lobbyConnections = new HashMap<>();


    public void addUserToLobby(long lobbyId, long userId) {
        lobbyConnections.putIfAbsent(lobbyId, new LinkedHashSet<>());
        lobbyConnections.get(lobbyId).add(userId);
    }

    public void removeUserFromLobby(long lobbyId, long userId) {
        Set<Long> users = lobbyConnections.get(lobbyId);
        if (users != null) {
            users.remove(userId);
            if (users.isEmpty()) {
                lobbyConnections.remove(lobbyId);
            }
        }
    }

    public Set<Long> getUsersInLobby(long lobbyId) {
        return lobbyConnections.getOrDefault(lobbyId, Collections.emptySet());
    }
}

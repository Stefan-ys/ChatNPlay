package com.quizzard.app.tracker;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;


@Component
@RequiredArgsConstructor
public class ChannelConnectionTracker {

    private final Map<Long, Set<Long>> lobbyConnections = new ConcurrentHashMap<>();
    private final Map<Long, Set<Long>> readyUsers = new ConcurrentHashMap<>();


    public void addUserToLobby(long lobbyId, long userId) {
        lobbyConnections.putIfAbsent(lobbyId, new LinkedHashSet<>());
        lobbyConnections.get(lobbyId).add(userId);
    }

    public void removeUserFromLobby(long lobbyId, long userId) {
        lobbyConnections.get(lobbyId).remove(userId);
        readyUsers.get(lobbyId).remove(userId);
    }

    public void changeUserStatus(long lobbyId, long userId) {
        readyUsers.putIfAbsent(lobbyId, new LinkedHashSet<>());
        if (!readyUsers.get(lobbyId).contains(userId)) {
            readyUsers.get(lobbyId).add(userId);
        } else {
            readyUsers.get(lobbyId).remove(userId);
        }
    }

    public Set<Long> getUsersByLobbyId(long lobbyId) {
        return lobbyConnections.getOrDefault(lobbyId, new LinkedHashSet<>());
    }

    public Set<Long> getReadyUsersByLobbyId(long lobbyId) {
        return readyUsers.getOrDefault(lobbyId, new LinkedHashSet<>());
    }
}

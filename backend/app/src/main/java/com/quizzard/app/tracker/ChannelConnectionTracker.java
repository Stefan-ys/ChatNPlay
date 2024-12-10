package com.quizzard.app.tracker;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

@Component
@RequiredArgsConstructor
public class ChannelConnectionTracker {

    private final Map<Long, Set<Long>> lobbyConnections = new ConcurrentHashMap<>();
    private final Map<Long, Set<Long>> readyUsers = new ConcurrentHashMap<>();

    public void addUserToLobby(long lobbyId, long userId) {
        lobbyConnections.computeIfAbsent(lobbyId, k -> new CopyOnWriteArraySet<>()).add(userId);
    }

    public void removeUserFromLobby(long lobbyId, long userId) {
        Set<Long> connections = lobbyConnections.get(lobbyId);
        if (connections != null) {
            connections.remove(userId);
            if (connections.isEmpty()) {
                lobbyConnections.remove(lobbyId);
            }
        }

        Set<Long> ready = readyUsers.get(lobbyId);
        if (ready != null) {
            ready.remove(userId);
            if (ready.isEmpty()) {
                readyUsers.remove(lobbyId);
            }
        }
    }

    public void changeUserStatus(long lobbyId, long userId) {
        readyUsers.computeIfAbsent(lobbyId, k -> new CopyOnWriteArraySet<>());
        Set<Long> readySet = readyUsers.get(lobbyId);

        if (!readySet.remove(userId)) {
            readySet.add(userId);
        }
    }

    public Set<Long> getUsersByLobbyId(long lobbyId) {
        return Collections.unmodifiableSet(lobbyConnections.getOrDefault(lobbyId, Collections.emptySet()));
    }

    public Set<Long> getReadyUsersByLobbyId(long lobbyId) {
        return Collections.unmodifiableSet(readyUsers.getOrDefault(lobbyId, Collections.emptySet()));
    }
}

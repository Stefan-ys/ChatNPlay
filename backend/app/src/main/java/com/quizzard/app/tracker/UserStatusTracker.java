package com.quizzard.app.tracker;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class UserStatusTracker {

    private final Set<Long> onlineUsers = new HashSet<>();


    public void addUser(long userId) {
        onlineUsers.add(userId);
    }

    public void removeUser(long userId) {
        onlineUsers.remove(userId);
    }

    public Set<Long> getOnlineUsers() {
        return onlineUsers;
    }
}

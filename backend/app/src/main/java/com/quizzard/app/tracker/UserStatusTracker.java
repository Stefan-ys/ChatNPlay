package com.quizzard.app.tracker;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;


@Component
@Getter
@RequiredArgsConstructor
public class UserStatusTracker {

    private final Set<Long> onlineUsers = new HashSet<>();


    public void addUser(long userId) {
        onlineUsers.add(userId);
    }

    public void removeUser(long userId) {
        onlineUsers.remove(userId);
    }
}

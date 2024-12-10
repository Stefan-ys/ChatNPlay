package com.quizzard.app.domain.model;

import java.util.UUID;

public class GameIdGenerator {
    private static final int MAX_LENGTH = 12;

    public static String generateGameId(String gameTitle, String ...usernames) {
        StringBuilder playerPart = new StringBuilder();
        for (int i = 0; i < usernames.length; i++) {
            String sanitizedUsername = sanitizeAndTruncateString(usernames[i]);
            playerPart.append(sanitizedUsername);
            if (i != usernames.length - 1) {
                playerPart.append("-vs-");
            }
        }
        String uniqueSuffix = UUID.randomUUID().toString().substring(0, 8);

        return String.format("%s-%s-%s", sanitizeAndTruncateString(gameTitle), playerPart, uniqueSuffix);
    }

    private static String sanitizeAndTruncateString(String string) {
        String sanitized = string.replaceAll("[^a-zA-Z0-9]", "");
        return sanitized.length() > MAX_LENGTH ? sanitized.substring(0, MAX_LENGTH) : sanitized;
    }
}

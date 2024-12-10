package com.quizzard.app.domain.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Game {

    private String id;


    public void setId(String gameTitle, String ...usernames) {
        this.id = GameIdGenerator.generateGameId(gameTitle, usernames);
    }
}

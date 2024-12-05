package com.quizzard.app.domain.model.QuizMaze.Perk;

public class DragonPerk extends Perk {

    public final static String NAME = "Dragon Perk";
    public final static String DESCRIPTION = "This perk permits you to move at any field apart from the enemy castle";

    public DragonPerk() {
        super(NAME, DESCRIPTION);
    }
}

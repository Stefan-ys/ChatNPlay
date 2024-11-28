package com.quizzard.app.domain.model;

public class CatapultPerk extends Perk {

    private final static String NAME = "Catapult Perk";
    private final static String DESCRIPTION = "This perk permits you to take one health point from enemy castle";

    public CatapultPerk() {
        super(NAME, DESCRIPTION);
    }
}

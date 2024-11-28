package com.quizzard.app.domain.model;

public class CastlePerk extends Perk {

    private final static String NAME = "Castle Perk";
    private final static String DESCRIPTION = "This perk add one point defence to player's castle";

    public CastlePerk() {
        super(NAME, DESCRIPTION);
    }
}

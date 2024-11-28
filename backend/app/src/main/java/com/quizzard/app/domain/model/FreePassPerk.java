package com.quizzard.app.domain.model;

public class FreePassPerk extends Perk {

    private final static String NAME = "Free pass Perk";
    private final static String DESCRIPTION = "This perk lets you to pass question without providing an answer";

    public FreePassPerk() {
        super(NAME, DESCRIPTION);
    }
}

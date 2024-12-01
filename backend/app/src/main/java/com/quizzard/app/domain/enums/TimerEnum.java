package com.quizzard.app.domain.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum TimerEnum {
    QUESTION(25), TURN(45);

    private final int duration;
}

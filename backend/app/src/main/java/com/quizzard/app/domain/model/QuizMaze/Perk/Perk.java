package com.quizzard.app.domain.model.QuizMaze.Perk;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public abstract class Perk {

    private String name;
    private String description;
}

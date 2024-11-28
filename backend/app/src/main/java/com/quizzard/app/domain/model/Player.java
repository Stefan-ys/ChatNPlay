package com.quizzard.app.domain.model;

import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Player {

    private long id;
    private String username;
    private String userAvatar;
    private int score;
    private List<Perk> perks = new ArrayList<>();

    public void addPoints(int points) {
        this.score += points;
    }

    public void addPerk(Perk perk) {
        this.perks.add(perk);
    }

    public void removePerk(Perk perk) {
        this.perks.remove(perk);
    }
}

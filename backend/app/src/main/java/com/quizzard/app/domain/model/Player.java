package com.quizzard.app.domain.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Player {

    private String username;
    private long id;
    private int gameScore;
    private List<Perk> perks = new ArrayList<>();

    public void addPerk(Perk perk) {
        this.perks.add(perk);
    }

    public void removePerk(Perk perk) {
        this.perks.remove(perk);
    }
}

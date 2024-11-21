package com.quizzard.app.domain.model;

import com.quizzard.app.domain.enums.PerkEnum;
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
    private List<PerkEnum> perks = new ArrayList<>();

    public void addPerk(PerkEnum perk) {
        this.perks.add(perk);
    }

    public void removePerk(PerkEnum perk) {
        this.perks.remove(perk);
    }
}

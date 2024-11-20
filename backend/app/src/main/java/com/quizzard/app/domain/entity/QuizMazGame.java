package com.quizzard.app.domain.entity;


import com.quizzard.app.domain.enums.GameNameEnum;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "games")
public class QuizMazGame extends BaseEntity {
    @Column
    private Map<User, Integer> playersScore = new HashMap<>();
    @Column
    private String result;
    @Enumerated(EnumType.STRING)
    @Column
    private GameNameEnum gameName;
}

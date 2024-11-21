package com.quizzard.app.domain.entity;

import com.quizzard.app.domain.enums.GameResultEnum;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "quiz-maze-results")
public class QuizMazeResult extends BaseEntity {

    @ManyToOne
    private User player1;
    @ManyToOne
    private User player2;
    private int player1Score;
    private int player2Score;
    @Enumerated(EnumType.STRING)
    private GameResultEnum gameResult;

}

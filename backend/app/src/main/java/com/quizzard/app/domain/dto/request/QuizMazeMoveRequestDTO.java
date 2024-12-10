package com.quizzard.app.domain.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
public class QuizMazeMoveRequestDTO {

    private long playerId;
    private byte row;
    private byte col;
}



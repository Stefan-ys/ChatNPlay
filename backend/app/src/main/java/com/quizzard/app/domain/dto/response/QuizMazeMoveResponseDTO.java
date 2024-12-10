package com.quizzard.app.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizMazeMoveResponseDTO {

    private String actionType;
    private long playerId;
    private byte row;
    private byte col;
}

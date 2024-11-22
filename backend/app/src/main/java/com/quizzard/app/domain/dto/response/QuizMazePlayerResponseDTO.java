package com.quizzard.app.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizMazePlayerResponseDTO {

    private long id;
    private String username;
    private int gameScore;
    private List<QuizMazePerkResponseDTO> perks;
}

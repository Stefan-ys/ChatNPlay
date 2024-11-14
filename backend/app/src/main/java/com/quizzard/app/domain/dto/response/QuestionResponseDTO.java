package com.quizzard.app.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionResponseDTO {

    private long id;
    private String question;
    private String imageUrl;
    private String answer;
    private String option1;
    private String option2;
    private String option3;
    private String option4;
}

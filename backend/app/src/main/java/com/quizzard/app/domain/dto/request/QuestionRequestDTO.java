package com.quizzard.app.domain.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionRequestDTO {

    @NotBlank(message = "question must have topic")
    private Long topicId;
    @NotBlank(message = "question must have text content")
    private String questionText;
    private MultipartFile imageFile;
    private String option1;
    private String option2;
    private String option3;
    private String option4;
    @NotBlank(message = "question must have correct answer")
    private String correctAnswer;
}

package com.quizzard.app.domain.dto.request;

import com.quizzard.app.validator.UniqueTopicTitle;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class TopicRequestDTO {

    @UniqueTopicTitle
    @NotBlank
    @Size(min = 1, max = 50)
    private String title;
    @NotBlank
    private String description;
}

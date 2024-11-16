package com.quizzard.app.domain.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OpenAIQuestionTopicRequestDTO {

    private String topic;
    private int count;
}

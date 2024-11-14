package com.quizzard.app.domain.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class OpenAIResponse {

    private List<Choice> choices;

    @JsonIgnoreProperties(ignoreUnknown = true)
    @Data
    public static class Choice {
        private String text;
    }
}

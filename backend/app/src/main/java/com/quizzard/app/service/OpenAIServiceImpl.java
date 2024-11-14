package com.quizzard.app.service;

import com.quizzard.app.domain.dto.response.OpenAIResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Service
public class OpenAIServiceImpl implements OpenAIService {

    private final RestTemplate restTemplate;
    private final String apiKey;
    private final String apiUrl;

    public OpenAIServiceImpl(RestTemplate restTemplate,
                         @Value("${openai.api.key}") String apiKey,
                         @Value("${openai.api.url}") String apiUrl) {
        this.restTemplate = restTemplate;
        this.apiKey = apiKey;
        this.apiUrl = apiUrl;
    }


    @Override
    public List<String> generateQuizQuestions(String topic, int questionCount) {
        String prompt = String.format("Generate %d multiple-choice quiz questions with answers (a, b, c, d) on the topic: %s", questionCount, topic);

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + apiKey);
        headers.set("Content-Type", "application/json");

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "text-davinci-003");
        requestBody.put("prompt", prompt);
        requestBody.put("max_tokens", 1500);
        requestBody.put("temperature", 0.7);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<OpenAIResponse> response = restTemplate.exchange(apiUrl, HttpMethod.POST, entity, OpenAIResponse.class);

        if (response.getBody() != null && !response.getBody().getChoices().isEmpty()) {
            return List.of(response.getBody().getChoices().getFirst().getText().split("\n\n"));
        }
        return List.of();
    }
}

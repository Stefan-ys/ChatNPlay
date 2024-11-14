package com.quizzard.app.service;

import java.util.List;

public interface OpenAIService {
    List<String> generateQuizQuestions(String topic, int questionCount);
}

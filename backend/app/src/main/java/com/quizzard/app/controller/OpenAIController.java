package com.quizzard.app.controller;

import com.quizzard.app.domain.dto.request.OpenAIQuestionTopicRequestDTO;
import com.quizzard.app.domain.entity.Question;
import com.quizzard.app.service.OpenAIService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/openai")
@RequiredArgsConstructor
public class OpenAIController {

    private final OpenAIService openAIService;

    @PostMapping("/generate")
    public List<Question> generateQuestions(@RequestBody OpenAIQuestionTopicRequestDTO requestDTO) {
        List<String> questions = openAIService.generateQuizQuestions(requestDTO.getTopic(), requestDTO.getCount());
        return questions.stream().map(questionText -> {
            Question question = new Question();
            question.setQuestionText(questionText);
            return question;
        }).toList();
    }
}

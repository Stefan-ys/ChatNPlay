package com.quizzard.app.controller;

import com.quizzard.app.domain.dto.request.QuestionRequestDTO;
import com.quizzard.app.domain.dto.response.QuestionResponseDTO;
import com.quizzard.app.service.QuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;


@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @PostMapping
    public ResponseEntity<Void> createQuestion(@RequestBody @Valid QuestionRequestDTO questionRequestDTO) {
         try {
            questionService.createQuestion(questionRequestDTO);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuestionResponseDTO> getQuestionById(@PathVariable long id) {
        try {
            QuestionResponseDTO question = questionService.getQuestionById(id);
            return ResponseEntity.ok(question);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/topic/{topicId}")
    public ResponseEntity<List<QuestionResponseDTO>> getQuestionsByTopicId(@PathVariable long topicId) {
        List<QuestionResponseDTO> questions = questionService.getQuestionsByTopicId(topicId);
        return ResponseEntity.ok(questions);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateQuestion(
            @PathVariable long id,
            @ModelAttribute QuestionRequestDTO questionRequestDTO) {
        try {
            questionService.updateQuestion(id, questionRequestDTO);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable long id) {
        try {
            questionService.deleteQuestion(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}

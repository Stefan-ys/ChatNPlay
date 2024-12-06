package com.quizzard.app.controller;

import com.quizzard.app.domain.dto.request.QuizMazeRequestDTO;
import com.quizzard.app.domain.dto.response.QuestionResponseDTO;
import com.quizzard.app.domain.dto.response.QuizMazeGameResponseDTO;
import com.quizzard.app.domain.dto.response.QuizMazeGameResponseLightDTO;
import com.quizzard.app.domain.enums.TimerEnum;
import com.quizzard.app.service.GameTimerService;
import com.quizzard.app.service.QuizMazeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/quiz-maze")
@RequiredArgsConstructor
public class QuizMazeController {

    private final QuizMazeService quizMazeService;
    private final GameTimerService gameTimerService;
    private final SimpMessagingTemplate messagingTemplate;

    @PostMapping("/{gameId}/join")
    public ResponseEntity<QuizMazeGameResponseDTO> joinGame(@PathVariable String gameId, @RequestParam long playerId) {
        QuizMazeGameResponseDTO gameResponse = quizMazeService.joinGame(gameId, playerId);
        return ResponseEntity.ok(gameResponse);
    }

    @MessageMapping("/update-game/{gameId}")
    @SendTo("/topic/quiz-maze/{gameId}")
    public QuizMazeGameResponseDTO updateGame(@RequestParam QuizMazeRequestDTO quizMazeRequestDTO) {
        return quizMazeService.getGameData(quizMazeRequestDTO);
    }

    @MessageMapping("/{gameId}/get-question")
    @SendTo("/topic/quiz-maze/{gameId}/question")
    public QuestionResponseDTO getQuestion(@PathVariable String gameId) {
        return quizMazeService.getRandomQuestion(gameId);
    }

    @MessageMapping("/{gameId}/start-question-timer")
    public void startQuestionTimer(@PathVariable String gameId) {
        gameTimerService.startTimer(gameId, TimerEnum.QUESTION.getDuration(), 2, () -> {
            int timeLeft = gameTimerService.getTimeLeft(gameId);
            messagingTemplate.convertAndSend("/topic/quiz-maze/" + gameId + "/timer", timeLeft);
        });
    }

    @MessageMapping("/{gameId}/start-turn-timer")
    public void startMoveTimer(@PathVariable String gameId) {
        gameTimerService.startTimer(gameId, TimerEnum.TURN.getDuration(), 3, () -> {
            int timeLeft = gameTimerService.getTimeLeft(gameId);
            messagingTemplate.convertAndSend("/topic/quiz-maze/" + gameId + "/timer", timeLeft);
        });
    }

    @MessageMapping("/{gameId}/submit-answer")
    @SendTo("/topic/quiz-maze/{gameId}/result")
    public int submitAnswer(@PathVariable String gameId, @RequestParam String submittedAnswer) {
        int timeLeft = gameTimerService.stopTimer(gameId);
        int score = quizMazeService.checkAnswer(gameId, submittedAnswer, timeLeft);

        return score + timeLeft;
    }
}

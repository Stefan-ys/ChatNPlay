package com.quizzard.app.controller;

import com.quizzard.app.domain.dto.request.QuizMazeMoveRequestDTO;
import com.quizzard.app.domain.dto.response.QuestionResponseDTO;
import com.quizzard.app.domain.dto.response.QuizMazeGameResponseDTO;
import com.quizzard.app.domain.dto.response.QuizMazeMoveResponseDTO;
import com.quizzard.app.domain.enums.TimerEnum;
import com.quizzard.app.service.GameTimerService;
import com.quizzard.app.service.QuizMazeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
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


    @GetMapping("/join/{gameId}")
    public ResponseEntity<QuizMazeGameResponseDTO> joinGame(@PathVariable String gameId, @RequestParam long playerId) {
        QuizMazeGameResponseDTO gameResponse = quizMazeService.joinGame(gameId, playerId);
        return ResponseEntity.ok(gameResponse);
    }

    @MessageMapping("/game/{gameId}/move")
    @SendTo("/topic/quiz-maze/{gameId}")
    public QuizMazeMoveResponseDTO handleGameMove(@DestinationVariable String gameId, @Payload QuizMazeMoveRequestDTO moveRequest) {
        System.out.println("Game Move Received for Game ID: " + gameId);
        System.out.println("Move Details: " + moveRequest);
        QuizMazeMoveResponseDTO responseDTO =  quizMazeService.processMove(gameId, moveRequest);
        System.out.println(responseDTO);
        return responseDTO;
    }

    @MessageMapping("/{gameId}/get-question")
    @SendTo("/topic/quiz-maze/{gameId}")
    public QuestionResponseDTO getQuestion(@DestinationVariable String gameId) {
        return quizMazeService.getRandomQuestion(gameId);
    }

    @MessageMapping("/{gameId}/start-question-timer")
    public void startQuestionTimer(@DestinationVariable String gameId) {
        gameTimerService.startTimer(gameId, TimerEnum.QUESTION.getDuration(), 1, () -> {
            int timeLeft = gameTimerService.getTimeLeft(gameId);
            messagingTemplate.convertAndSend("/topic/quiz-maze/" + gameId, timeLeft);

            if (timeLeft <= 0) {
                messagingTemplate.convertAndSend("/topic/quiz-maze/" + gameId, "Question timer ended!");
            }
        });
    }

    @MessageMapping("/{gameId}/start-turn-timer")
    public void startTurnTimer(@DestinationVariable String gameId) {
        gameTimerService.startTimer(gameId, TimerEnum.TURN.getDuration(), 3, () -> {
            int timeLeft = gameTimerService.getTimeLeft(gameId);
            messagingTemplate.convertAndSend("/topic/quiz-maze/" + gameId + "/timer", timeLeft);

            if (timeLeft <= 0) {
                messagingTemplate.convertAndSend("/topic/quiz-maze/" + gameId + "/timer-end", "Turn timer ended!");
            }
        });
    }

    @MessageMapping("/{gameId}/submit-answer")
    @SendTo("/topic/quiz-maze/{gameId}")
    public int submitAnswer(@DestinationVariable String gameId, @Payload String submittedAnswer) {
        int timeLeft = gameTimerService.stopTimer(gameId);
        int score = quizMazeService.checkAnswer(gameId, submittedAnswer, timeLeft);

        messagingTemplate.convertAndSend("/topic/quiz-maze/" + gameId + "/score-update", score);

        return score + timeLeft;
    }
}

package com.quizzard.app.service;

import com.quizzard.app.domain.dto.response.QuestionResponseDTO;
import com.quizzard.app.domain.entity.Question;
import com.quizzard.app.domain.model.Player;
import com.quizzard.app.domain.model.QuizMazeGame;
import com.quizzard.app.repository.QuestionRepository;
import com.quizzard.app.repository.UserRepository;
import com.quizzard.app.tracker.GameTracker;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class QuizMazeServiceImpl implements QuizMazeService {

    private final GameTracker gameTracker;
    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;
    private final ModelMapper modelMapper;

    @Override
    public String startNewGame(long player1Id, long player2Id) {
        Player player1 = modelMapper.map(userRepository.findById(player1Id), Player.class);
        Player player2 = modelMapper.map(userRepository.findById(player2Id), Player.class);

        QuizMazeGame quizMazeGame = new QuizMazeGame(player1, player2);

        String gameId = QuizMazeGame.TITLE + "->" + player1.getUsername() + "-vs-" + player2.getUsername();

        quizMazeGame.setId(gameId);
        quizMazeGame.setPlayer1(player1);
        quizMazeGame.setPlayer2(player2);

        gameTracker.createGame(quizMazeGame);

        return gameId;
    }

    public byte[] markPlayerMove(String gameId, byte x, byte y) {
        ((QuizMazeGame) gameTracker.getGame(gameId)).playerAttemptMove(x, y);
        return new byte[]{x, y};
    }

    public QuestionResponseDTO getRandomQuestion(String gameId) {
        long totalQuestions = questionRepository.count();
        long randomOffset = ThreadLocalRandom.current().nextLong(totalQuestions);

        Question question = questionRepository.findRandomQuestion()
                .orElseThrow(() -> new IllegalArgumentException("Question not found"));

        ((QuizMazeGame) gameTracker.getGame(gameId)).setCurentQuestion(question);

        return modelMapper.map(question, QuestionResponseDTO.class);
    }

    public void questionAnswerCheck(String gameId, String response, byte x, byte y) {
        QuizMazeGame game = (QuizMazeGame) gameTracker.getGame(gameId);

        if (game.getCurentQuestion().getCorrectAnswer().equals(response)) {
            game.playerSuccessfulAnswer(x, y);
        }

        game.setCurentQuestion(null);
        game.switchPlayers();

    }
}

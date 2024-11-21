package com.quizzard.app.service;

import com.quizzard.app.domain.entity.User;
import com.quizzard.app.domain.model.Player;
import com.quizzard.app.domain.model.QuizMazeGame;
import com.quizzard.app.exception.UserNotFoundException;
import com.quizzard.app.repository.UserRepository;
import com.quizzard.app.tracker.GameTracker;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class QuizMazeServiceImpl implements QuizMazeService {

    private final GameTracker gameTracker;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Override
    public String startNewGame(long player1Id, long player2Id) {
        QuizMazeGame quizMazeGame = new QuizMazeGame();

        User user1 = userRepository.findById(player1Id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id:" + player1Id));
        User user2 = userRepository.findById(player2Id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id:" + player2Id));

        Player player1 = modelMapper.map(user1, Player.class);
        Player player2 = modelMapper.map(user2, Player.class);

        String gameId = QuizMazeGame.TITLE + "->" + player1.getUsername() + "-vs-" + player2.getUsername();

        quizMazeGame.setId(gameId);
        quizMazeGame.setPlayer1(player1);
        quizMazeGame.setPlayer2(player2);

        return gameId;
    }


}

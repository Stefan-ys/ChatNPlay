package com.quizzard.app.service;


import com.quizzard.app.domain.dto.response.UserStatusResponseDTO;
import com.quizzard.app.domain.entity.User;
import com.quizzard.app.exception.UserNotFoundException;
import com.quizzard.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserStatusServiceImp implements UserStatusService {

    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;


    @Override
    public void updateUserStatus(Long userId, boolean isOnline) {
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User not found!"));
        user.setOnline(isOnline);
        userRepository.save(user);

        messagingTemplate.convertAndSend("/topic/user-status", new UserStatusResponseDTO(userId, isOnline));
    }
}

package com.quizzard.app.service;


import com.quizzard.app.dto.response.UserStatusResponseDTO;
import com.quizzard.app.entity.User;
import com.quizzard.app.exception.UserNotFoundException;
import com.quizzard.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class UserStatusServiceImp implements UserStatusService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;


    @Override
    public void updateUserStatus(Long userId, boolean isOnline) {
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User not found!"));
        user.setOnline(isOnline);
        userRepository.save(user);

        messagingTemplate.convertAndSend("/topic/user-status", new UserStatusResponseDTO(userId, isOnline));
    }
}

package com.quizzard.app.service;


import com.quizzard.app.dto.UserProfileUpdateDTO;
import com.quizzard.app.dto.UserResponseDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface UserService {
    List<UserResponseDTO> getAllUsers();

    UserResponseDTO findByUsername(String username);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    String uploadAvatar(MultipartFile file) throws IOException;

    UserResponseDTO updateProfile(Long userId, UserProfileUpdateDTO userProfileUpdateDTO) throws Exception;

    void addRole(Long userId, String role);

    void removeRole(Long userId, String role);
}

package com.quizzard.app.service;

import com.quizzard.app.dto.LoginDTO;
import com.quizzard.app.dto.RegisterDTO;
import com.quizzard.app.dto.UserResponseDTO;


public interface AuthService {

    public UserResponseDTO registerUser(RegisterDTO registerDTO);

    UserResponseDTO loginUser(LoginDTO loginDTO);
}

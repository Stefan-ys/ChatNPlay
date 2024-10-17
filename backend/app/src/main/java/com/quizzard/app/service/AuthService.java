package com.quizzard.app.service;

import com.quizzard.app.dto.request.LoginRequestDTO;
import com.quizzard.app.dto.request.RegisterRequestDTO;
import com.quizzard.app.dto.response.UserResponseDTO;


public interface AuthService {

    UserResponseDTO registerUser(RegisterRequestDTO registerRequestDTO);

    UserResponseDTO loginUser(LoginRequestDTO loginDTO);
}

package com.quizzard.app.service;

import com.quizzard.app.domain.dto.request.LoginRequestDTO;
import com.quizzard.app.domain.dto.request.RegisterRequestDTO;
import com.quizzard.app.domain.dto.response.UserResponseDTO;


public interface AuthService {

    UserResponseDTO registerUser(RegisterRequestDTO registerRequestDTO);

    UserResponseDTO loginUser(LoginRequestDTO loginDTO);
}

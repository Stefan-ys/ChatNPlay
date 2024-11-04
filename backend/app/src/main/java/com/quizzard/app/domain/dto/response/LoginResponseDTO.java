package com.quizzard.app.domain.dto.response;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDTO {

    private String token;
    private String refreshToken;
    private UserResponseDTO user;
}

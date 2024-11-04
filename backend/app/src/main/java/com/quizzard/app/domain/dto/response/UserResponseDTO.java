package com.quizzard.app.domain.dto.response;

import lombok.*;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDTO {

    private Long id;
    private String avatarUrl;
    private String username;
    private String email;
    private String role;
    private int score;
    private boolean isOnline;
}

package com.quizzard.app.dto;

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

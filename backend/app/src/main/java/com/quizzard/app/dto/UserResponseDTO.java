package com.quizzard.app.dto;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class UserResponseDTO {

    private Long id;
    private String username;
    private String email;
    private String role;
    private int score;
}

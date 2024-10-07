package com.quizzard.app.dto;

import lombok.*;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginDTO {

    private String username;
    private String password;
}

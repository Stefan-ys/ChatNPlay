package com.quizzard.app.dto.request;

import lombok.*;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequestDTO {

    private String username;
    private String password;
}

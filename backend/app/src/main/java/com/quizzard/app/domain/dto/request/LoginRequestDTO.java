package com.quizzard.app.domain.dto.request;

import lombok.*;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequestDTO {

    private String username;
    private String password;
}

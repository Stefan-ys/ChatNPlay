package com.quizzard.app.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserLobbyResponseDTO extends UserResponseDTO {

    private boolean isReady;
}

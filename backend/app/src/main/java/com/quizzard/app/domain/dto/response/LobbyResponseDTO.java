package com.quizzard.app.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class LobbyResponseDTO {

    private Long id;
    private String name;
    private Long chatId;
}

package com.quizzard.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;
import java.util.HashSet;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LobbyDTO {

    private Long id;
    private Set<UserResponseDTO> users = new HashSet<>();
}

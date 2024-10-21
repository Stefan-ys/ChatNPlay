package com.quizzard.app.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LobbyResponseDTO {

    private Long id;
    private String name;
    private List<CommentResponseDTO> chat = new ArrayList<>();
    private List<UserResponseDTO> users = new ArrayList<>();
}

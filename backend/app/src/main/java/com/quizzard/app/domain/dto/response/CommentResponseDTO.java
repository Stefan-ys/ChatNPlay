package com.quizzard.app.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponseDTO {

    private Long id;
    private UserResponseDTO user;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String type;
}

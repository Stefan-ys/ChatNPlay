package com.quizzard.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentDTO {

    private Long userId;
    private Long chatId;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

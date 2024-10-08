package com.quizzard.app.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentRequestDTO {

    private Long userId;
    private Long chatId;
    private String content;
}

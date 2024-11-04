package com.quizzard.app.domain.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponseDTO {

    private Long id;
    private List<CommentResponseDTO> comments = new ArrayList<>();
}

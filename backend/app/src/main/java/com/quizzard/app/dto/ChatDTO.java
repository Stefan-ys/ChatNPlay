package com.quizzard.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatDTO {

    private Long id;
    private Set<CommentDTO> comments = new HashSet<>();
}

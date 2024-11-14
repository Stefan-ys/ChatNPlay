package com.quizzard.app.domain.dto.response;

import lombok.Data;

@Data
public class TopicResponseDTO {

    private long id;
    private String title;
    private String description;
    private String imageUrl;
}

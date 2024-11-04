package com.quizzard.app.domain.dto.request;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MyProfileRequestDTO {

    private MultipartFile avatar;
}

package com.quizzard.app.dto.request;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MyProfileRequestDTO {

    private MultipartFile avatar;
}

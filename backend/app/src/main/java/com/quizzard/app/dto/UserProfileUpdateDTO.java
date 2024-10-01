package com.quizzard.app.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class UserProfileUpdateDTO {

    private MultipartFile avatarFile;
}

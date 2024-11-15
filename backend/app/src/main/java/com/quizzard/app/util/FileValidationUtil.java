package com.quizzard.app.util;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;


@Component
public class FileValidationUtil {

    public boolean isValidImageFile(MultipartFile multipartFile) {
        String contentType = multipartFile.getContentType();
        if(contentType == null) {
            return false;
        }
        return contentType.equals("image/jpeg") || contentType.equals("image/jpg") || contentType.equals("image/png");
    }
}

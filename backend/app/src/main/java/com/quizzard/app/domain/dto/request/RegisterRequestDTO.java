package com.quizzard.app.domain.dto.request;

import com.quizzard.app.common.Constraints;
import com.quizzard.app.validator.PasswordMatching;
import com.quizzard.app.validator.UniqueEmail;
import com.quizzard.app.validator.UniqueUsername;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;


@Data
@NoArgsConstructor
@PasswordMatching(
        password = "password",
        confirmPassword = "confirmPassword"
)
public class RegisterRequestDTO {

    @UniqueUsername
    @NotBlank(message = "Username is required")
    @Size(
            min = Constraints.USERNAME_MIN_LENGTH,
            max = Constraints.USERNAME_MAX_LENGTH,
            message = Constraints.USERNAME_LENGTH_MESSAGE
    )
    private String username;

    @UniqueEmail
    @NotBlank(message = "Email is required")
    @Email(message = "Email mus be valid")
    private String email;

    @NotBlank(message = "Password required")
    @Size(
            min = Constraints.PASSWORD_MIN_LENGTH,
            max = Constraints.PASSWORD_MAX_LENGTH,
            message = Constraints.PASSWORD_LENGTH_MESSAGE
    )
    private String password;

    @NotBlank(message = "Confirm password required")
    private String confirmPassword;
}

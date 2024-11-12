package com.quizzard.app.validator;

import com.quizzard.app.domain.dto.request.RegisterRequestDTO;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.BeanWrapperImpl;

import java.util.Objects;

public class PasswordMatchingValidator implements ConstraintValidator<PasswordMatching, RegisterRequestDTO> {

    private String password;
    private String confirmPassword;


    @Override
    public void initialize(PasswordMatching matching) {
        this.password = matching.password();
        this.confirmPassword = matching.confirmPassword();
    }

    @Override
    public boolean isValid(RegisterRequestDTO registerRequestDTO, ConstraintValidatorContext constraintValidatorContext) {
        Object passwordValue = new BeanWrapperImpl(registerRequestDTO).getPropertyValue(password);
        Object confirmPasswordValue = new BeanWrapperImpl(registerRequestDTO).getPropertyValue(confirmPassword);

        return Objects.equals(passwordValue, confirmPasswordValue);
    }
}

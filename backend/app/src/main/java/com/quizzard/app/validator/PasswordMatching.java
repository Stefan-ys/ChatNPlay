package com.quizzard.app.validator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;


@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = PasswordMatchingValidator.class)
public @interface PasswordMatching {

    String password();

    String confirmPassword();

    String message() default "Password and Confirm Password does not match";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

}


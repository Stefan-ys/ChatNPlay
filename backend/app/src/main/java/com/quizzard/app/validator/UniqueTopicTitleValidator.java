package com.quizzard.app.validator;

import com.quizzard.app.repository.TopicRepository;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class UniqueTopicTitleValidator implements ConstraintValidator<UniqueTopicTitle, String> {

    private final TopicRepository topicRepository;

    @Override
    public void initialize(UniqueTopicTitle constraintAnnotation) {
    }

    @Override
    public boolean isValid(String title, ConstraintValidatorContext constraintValidatorContext) {
        return !topicRepository.existsByTitle(title);
    }
}


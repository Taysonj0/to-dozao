package br.edu.ufape.todozao.model;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class SubtaskUnitTest {

    private static ValidatorFactory factory;
    private static Validator validator;

    @BeforeAll
    static void setupValidator() {
        factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @AfterAll
    static void closeFactory() {
        factory.close();
    }

    @Test
    void titleMustNotBeBlankAndCompletedDefaultsToFalse() {
        Subtask s1 = Subtask.builder()
                .title("")
                .build();

        Set<ConstraintViolation<Subtask>> violations = validator.validate(s1);
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("title")));

        Subtask s2 = Subtask.builder()
                .title("Subtask Test")
                .build();

        violations = validator.validate(s2);
        assertTrue(violations.isEmpty());
        // boolean primitive defaults to false when not set
        assertFalse(s2.isCompleted());
    }
}

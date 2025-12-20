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

class RecurrenceRuleUnitTest {

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
    void intervalIsRequiredAndMustBePositive() {
        RecurrenceRule r1 = RecurrenceRule.builder()
                .recurrenceType("diariamente")
                .interval(null)
                .build();

        Set<ConstraintViolation<RecurrenceRule>> violations = validator.validate(r1);
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("interval")));

        RecurrenceRule r2 = RecurrenceRule.builder()
                .recurrenceType("diariamente")
                .interval(0)
                .build();

        violations = validator.validate(r2);
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("interval")));

        RecurrenceRule r3 = RecurrenceRule.builder()
                .recurrenceType("diariamente")
                .interval(1)
                .build();

        violations = validator.validate(r3);
        assertTrue(violations.isEmpty());
    }
}

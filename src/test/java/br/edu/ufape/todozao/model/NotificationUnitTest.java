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

class NotificationUnitTest {

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
    void titleAndMessageMustNotBeBlankAndReadDefaultsToFalse() {
        Notification n1 = new Notification();
        n1.setTitle("");
        n1.setMessage("");

        Set<ConstraintViolation<Notification>> violations = validator.validate(n1);
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("title")));
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("message")));

        Notification n2 = new Notification();
        n2.setTitle("T");
        n2.setMessage("M");

        violations = validator.validate(n2);
        assertTrue(violations.isEmpty());
        assertFalse(n2.isRead());
    }
}

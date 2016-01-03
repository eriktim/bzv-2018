package com.gingerik.bzv.model;

import org.junit.BeforeClass;
import org.junit.Test;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Set;

import static org.junit.Assert.assertEquals;

public class CandidateTest {

  private static Validator validator;
  private static Peasant peasant;

  @BeforeClass
  public static void setUp() {
    ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
    validator = factory.getValidator();
    peasant = new Peasant(2000, "Peasant");
  }

  @Test
  public void peasantNotNull() {
    Candidate candidate = new Candidate(null, "Candidate");

    Set<ConstraintViolation<Candidate>> constraintViolations =
        validator.validate(candidate);

    assertEquals(1, constraintViolations.size());
    assertEquals(
        "may not be null",
        constraintViolations.iterator().next().getMessage()
    );
  }

  @Test
  public void nameNotBlank() {
    Candidate candidate = new Candidate(peasant, "");

    Set<ConstraintViolation<Candidate>> constraintViolations =
        validator.validate(candidate);

    assertEquals(1, constraintViolations.size());
    assertEquals(
        "may not be empty",
        constraintViolations.iterator().next().getMessage()
    );
  }

  @Test
  public void candidateIsValid() {
    Candidate candidate = new Candidate(peasant, "Candidate");

    Set<ConstraintViolation<Candidate>> constraintViolations =
        validator.validate(candidate);

    assertEquals(0, constraintViolations.size());
  }

  @Test
  public void droppedCandidateIsValid() {
    Candidate candidate = new Candidate(
        peasant, "Candidate", LocalDateTime.now());

    Set<ConstraintViolation<Candidate>> constraintViolations =
        validator.validate(candidate);

    assertEquals(0, constraintViolations.size());
  }
}
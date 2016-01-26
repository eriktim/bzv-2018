package com.gingerik.bzv.model;

import org.junit.BeforeClass;
import org.junit.Test;

import java.time.LocalDateTime;
import java.util.Set;
import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;

public class CandidateTest {

  private static Validator validator;
  private static Peasant peasant;

  @BeforeClass
  public static void setUp() {
    ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
    validator = factory.getValidator();
    peasant = new Peasant(2000, "Peasant");
  }

  @Test()
  public void nameNotNull() {
    Candidate candidate = new Candidate(null, peasant);

    Set<ConstraintViolation<Candidate>> constraintViolations =
        validator.validate(candidate);

    assertEquals(1, constraintViolations.size());
    assertEquals(
        "may not be null",
        constraintViolations.iterator().next().getMessage()
    );
  }

  @Test()
  public void peasantNotNull() {
    Candidate candidate = new Candidate("Candidate", null);

    Set<ConstraintViolation<Candidate>> constraintViolations =
        validator.validate(candidate);

    assertEquals(1, constraintViolations.size());
    assertEquals(
        "may not be null",
        constraintViolations.iterator().next().getMessage()
    );
  }

  @Test
  public void nameMinSize() {
    Candidate candidate = new Candidate("", peasant);

    Set<ConstraintViolation<Candidate>> constraintViolations =
        validator.validate(candidate);

    assertEquals(1, constraintViolations.size());
    assertEquals(
        "size must be between 2 and 255",
        constraintViolations.iterator().next().getMessage()
    );
  }

  @Test
  public void candidateIsValid() {
    Candidate candidate = new Candidate("Candidate", peasant);

    Set<ConstraintViolation<Candidate>> constraintViolations =
        validator.validate(candidate);

    assertEquals(0, constraintViolations.size());
    assertEquals(true, peasant.getCandidates().contains(candidate));
  }

  @Test
  public void droppedCandidateIsValid() {
    Candidate candidate = new Candidate(
        "Candidate", peasant, LocalDateTime.now());

    Set<ConstraintViolation<Candidate>> constraintViolations =
        validator.validate(candidate);

    assertEquals(0, constraintViolations.size());
  }

  @Test
  public void candidateIsLover() {
    Peasant peasant = new Peasant(2000, "Peasant");
    Candidate candidate = new Candidate("Candidate", peasant);

    assertEquals(candidate, peasant.getLover().orElse(null));
    assertEquals(true, candidate.isLover());
  }

  @Test
  public void candidateIsNoLover() {
    Peasant peasant = new Peasant(2000, "Peasant");
    Candidate candidate = new Candidate("Candidate", peasant, LocalDateTime.now());

    assertNotEquals(null, peasant.getLover().orElse(null));
    assertNotEquals(candidate, peasant.getLover().orElse(null));
    assertEquals(false, candidate.isLover());
  }

  @Test
  public void candidatesCanBeLovers() {
    Peasant peasant = new Peasant(2000, "Peasant");
    Candidate candidateA = new Candidate("CandidateA", peasant);
    Candidate candidateB = new Candidate("CandidateB", peasant);

    assertEquals(null, peasant.getLover().orElse(null));
    assertEquals(false, candidateA.isLover());
    assertEquals(false, candidateA.isLover());
  }

}
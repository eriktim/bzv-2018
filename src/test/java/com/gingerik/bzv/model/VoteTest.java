package com.gingerik.bzv.model;

import org.junit.BeforeClass;
import org.junit.Test;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;
import java.text.ParseException;
import java.time.LocalDateTime;
import java.util.Set;

import static org.junit.Assert.assertEquals;

public class VoteTest {

  private static Validator validator;
  private static Peasant peasant;
  private static Candidate candidate;
  private static Candidate droppedCandidate;
  private static Period period;
  private static Period endedPeriod;
  private static User user;

  @BeforeClass
  public static void setUp() throws ParseException {
    ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
    LocalDateTime now = LocalDateTime.now();
    validator = factory.getValidator();
    peasant = new Peasant(2000, "Peasant");
    candidate = new Candidate(peasant, "Candidate");
    droppedCandidate = new Candidate(peasant, "DroppedCandidate", now.minusDays(5));
    period = new Period(
        2000,
        now.minusDays(1),
        now.plusDays(1),
        now.plusDays(2),
        1);
    endedPeriod = new Period(
        2000,
        now.minusDays(3),
        now.minusDays(2),
        now.minusDays(1),
        1);
    user = new User(2000, "User", UserTest.EMAIL, UserTest.HASH);
  }

  @Test
  public void userNotNull() {
    Vote vote = new Vote(null, candidate, period, Vote.Type.GOOD);

    Set<ConstraintViolation<Vote>> constraintViolations =
        validator.validate(vote);

    assertEquals(1, constraintViolations.size());
    assertEquals(
        "may not be null",
        constraintViolations.iterator().next().getMessage()
    );
  }

  @Test
  public void candidateNotNull() {
    Vote vote = new Vote(user, null, period, Vote.Type.GOOD);

    Set<ConstraintViolation<Vote>> constraintViolations =
        validator.validate(vote);

    assertEquals(1, constraintViolations.size());
    assertEquals(
        "may not be null",
        constraintViolations.iterator().next().getMessage()
    );
  }

  @Test
  public void periodNotNull() {
    Vote vote = new Vote(user, candidate, null, Vote.Type.GOOD);

    Set<ConstraintViolation<Vote>> constraintViolations =
        validator.validate(vote);

    assertEquals(1, constraintViolations.size());
    assertEquals(
        "may not be null",
        constraintViolations.iterator().next().getMessage()
    );
  }

  @Test
  public void typeNotNull() {
    Vote vote = new Vote(user, candidate, period, null);

    Set<ConstraintViolation<Vote>> constraintViolations =
        validator.validate(vote);

    assertEquals(1, constraintViolations.size());
    assertEquals(
        "may not be null",
        constraintViolations.iterator().next().getMessage()
    );
  }

  @Test
  public void voteOnDroppedCandidate() {
    Vote vote = new Vote(user, droppedCandidate, period, Vote.Type.BAD);

    Set<ConstraintViolation<Vote>> constraintViolations =
        validator.validate(vote);

    assertEquals(1, constraintViolations.size());
    assertEquals(
        "vote candidate should not be dropped",
        constraintViolations.iterator().next().getMessage()
    );
  }

  @Test
  public void voteOnEndedPeriod() {
    Vote vote = new Vote(user, candidate, endedPeriod, Vote.Type.BAD);

    Set<ConstraintViolation<Vote>> constraintViolations =
        validator.validate(vote);

    assertEquals(1, constraintViolations.size());
    assertEquals(
        "vote should be within the period",
        constraintViolations.iterator().next().getMessage()
    );
  }

  @Test
  public void voteIsValid() {
    Vote vote = new Vote(user, candidate, period, Vote.Type.GOOD);

    Set<ConstraintViolation<Vote>> constraintViolations =
        validator.validate(vote);

    assertEquals(0, constraintViolations.size());
  }
}
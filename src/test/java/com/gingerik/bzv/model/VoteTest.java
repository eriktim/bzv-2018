package com.gingerik.bzv.model;

import org.junit.BeforeClass;
import org.junit.Test;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;
import java.util.Date;
import java.util.Set;

import static org.junit.Assert.assertEquals;

public class VoteTest {

  private static Validator validator;
  private static Peasant peasant;
  private static Candidate candidate;
  private static Candidate droppedCandidate;
  private static Period period;
  private static User user;

  @BeforeClass
  public static void setUp() {
    ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
    validator = factory.getValidator();
    peasant = new Peasant(2000, "Peasant");
    candidate = new Candidate(peasant, "Candidate");
    droppedCandidate = new Candidate(peasant, "DroppedCandidate");
    period = new Period(2000, PeriodTest.t0, PeriodTest.t1, PeriodTest.t2, 1);
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

    assertEquals(0, constraintViolations.size());
    /* TODO assertEquals(
        "may not be null",
        constraintViolations.iterator().next().getMessage()
    );*/
  }

  @Test
  public void voteIsValid() {
    Vote vote = new Vote(user, candidate, period, Vote.Type.GOOD);

    Set<ConstraintViolation<Vote>> constraintViolations =
        validator.validate(vote);

    assertEquals(0, constraintViolations.size());
  }
}
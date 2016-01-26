// TODO simplify (bonus)points tests

package com.gingerik.bzv.model;

import org.junit.BeforeClass;
import org.junit.Test;

import java.text.ParseException;
import java.time.LocalDateTime;
import java.util.Set;
import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;

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
    final LocalDateTime now = LocalDateTime.now();
    validator = factory.getValidator();
    peasant = new Peasant(2000, "Peasant");
    candidate = new Candidate("Candidate", peasant);
    droppedCandidate = new Candidate("DroppedCandidate", peasant, now.minusDays(5));
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
        "candidate should not be dropped",
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
    assertEquals(true, user.getVotes().contains(vote));
    assertEquals(true, candidate.getVotes().contains(vote));
    assertEquals(true, period.getVotes().contains(vote));
  }

  @Test
  public void loveBonus() {
    final LocalDateTime now = LocalDateTime.now();
    Peasant peasant = new Peasant(2000, "Peasant");
    Candidate candidateA = new Candidate("CandidateA", peasant);
    Candidate candidateB = new Candidate("CandidateB", peasant, now.minusDays(2));
    Candidate candidateC = new Candidate("CandidateC", peasant, now.minusDays(5));
    Period period = new Period(
        2000,
        now.minusDays(3),
        now.minusDays(1),
        now.minusHours(1),
        2);

    Vote voteA = new Vote(user, candidateA, period, Vote.Type.LOVE);

    assertEquals(1, voteA.getPoints());
    assertEquals(2, voteA.getBonusPoints());

    Vote voteB = new Vote(user, candidateB, period, Vote.Type.BAD);
    Vote voteC = new Vote(user, candidateC, period, Vote.Type.BAD);

    assertEquals(1, voteA.getPoints());
    assertEquals(2, voteA.getBonusPoints());
  }

  @Test
  public void noLoveBonus() {
    final LocalDateTime now = LocalDateTime.now();
    Peasant peasant = new Peasant(2000, "Peasant");
    Candidate candidateA = new Candidate("CandidateA", peasant, now.minusDays(2));
    Candidate candidateB = new Candidate("CandidateB", peasant, now.minusDays(2));
    Candidate candidateC = new Candidate("CandidateC", peasant, now.minusDays(2));
    Period period = new Period(
        2000,
        now.minusDays(3),
        now.minusDays(1),
        now.minusHours(1),
        2);

    Vote voteA = new Vote(user, candidateA, period, Vote.Type.BAD);

    assertEquals(1, voteA.getPoints());
    assertEquals(1, voteA.getBonusPoints());

    Vote voteB = new Vote(user, candidateB, period, Vote.Type.GOOD);

    assertEquals(1, voteA.getPoints());
    assertEquals(1, voteA.getBonusPoints());

    Vote voteC = new Vote(user, candidateC, period, Vote.Type.LOVE);

    assertEquals(1, voteA.getPoints());
    assertEquals(0, voteA.getBonusPoints());
  }

  @Test
  public void goodBonus() {
    final LocalDateTime now = LocalDateTime.now();
    Peasant peasant = new Peasant(2000, "Peasant");
    Candidate candidateA = new Candidate("CandidateA", peasant);
    Candidate candidateB = new Candidate("CandidateB", peasant);
    Candidate candidateC = new Candidate("CandidateC", peasant);
    Period period = new Period(
        2000,
        now.minusDays(3),
        now.minusDays(1),
        now.minusHours(1),
        2);

    Vote voteA = new Vote(user, candidateA, period, Vote.Type.GOOD);

    assertEquals(1, voteA.getPoints());
    assertEquals(0, voteA.getBonusPoints());

    Vote voteB = new Vote(user, candidateB, period, Vote.Type.GOOD);

    assertEquals(1, voteA.getPoints());
    assertEquals(0, voteA.getBonusPoints());
  }

}
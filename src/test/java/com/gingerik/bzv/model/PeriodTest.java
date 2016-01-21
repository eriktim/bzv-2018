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

public class PeriodTest {

  private static Validator validator;
  private final static LocalDateTime t0 = LocalDateTime.now().minusDays(1);
  private final static LocalDateTime t1 = LocalDateTime.now().plusDays(1);
  private final static LocalDateTime t2 = LocalDateTime.now().plusDays(2);

  @BeforeClass
  public static void setUp() throws ParseException {
    ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
    validator = factory.getValidator();
  }

  @Test()
  public void startNotNull() {
    Period period = new Period(2000, null, t1, t2, 1);

    Set<ConstraintViolation<Period>> constraintViolations =
        validator.validate(period);

    assertEquals(1, constraintViolations.size());
    assertEquals(
        "may not be null",
        constraintViolations.iterator().next().getMessage()
    );
  }

  @Test()
  public void endNotNull() {
    Period period = new Period(2000, t0, null, t2, 1);

    Set<ConstraintViolation<Period>> constraintViolations =
        validator.validate(period);

    assertEquals(1, constraintViolations.size());
    assertEquals(
        "may not be null",
        constraintViolations.iterator().next().getMessage()
    );
  }

  @Test
  public void yearTooLow() {
    Period period = new Period(1900, t0, t1, t2, 1);

    Set<ConstraintViolation<Period>> constraintViolations =
        validator.validate(period);

    assertEquals(1, constraintViolations.size());
    assertEquals(
        "must be greater than or equal to 2000",
        constraintViolations.iterator().next().getMessage()
    );
  }

  @Test
  public void endBeforeStart() {
    Period period = new Period(2000, t1, t0, t2, 1);

    Set<ConstraintViolation<Period>> constraintViolations =
        validator.validate(period);

    assertEquals(1, constraintViolations.size());
    assertEquals(
        "period dates should be valid",
        constraintViolations.iterator().next().getMessage()
    );
  }

  @Test
  public void referenceWithinPeriod() {
    Period period = new Period(2000, t0, t2, t1, 1);

    Set<ConstraintViolation<Period>> constraintViolations =
        validator.validate(period);

    assertEquals(1, constraintViolations.size());
    assertEquals(
        "period dates should be valid",
        constraintViolations.iterator().next().getMessage()
    );
  }

  @Test
  public void numberOfVotesTooLow() {
    Period period = new Period(2000, t0, t1, t2, 0);

    Set<ConstraintViolation<Period>> constraintViolations =
        validator.validate(period);

    assertEquals(1, constraintViolations.size());
    assertEquals(
        "must be greater than or equal to 1",
        constraintViolations.iterator().next().getMessage()
    );
  }

  @Test
  public void numberOfVotesTooHigh() {
    Period period = new Period(2000, t0, t1, t2, 10);

    Set<ConstraintViolation<Period>> constraintViolations =
        validator.validate(period);

    assertEquals(1, constraintViolations.size());
    assertEquals(
        "must be less than or equal to 5",
        constraintViolations.iterator().next().getMessage()
    );
  }

  @Test
  public void periodIsValid() {
    Period period = new Period(2000, t0, t1, t2, 1);

    Set<ConstraintViolation<Period>> constraintViolations =
        validator.validate(period);

    assertEquals(0, constraintViolations.size());
  }
}
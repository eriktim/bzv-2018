package com.gingerik.bzv.model;

import org.junit.BeforeClass;
import org.junit.Test;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;
import java.util.Set;

import static org.junit.Assert.assertEquals;

public class PeasantTest {

  private static Validator validator;

  @BeforeClass
  public static void setUp() {
    ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
    validator = factory.getValidator();
  }

  @Test
  public void yearTooLow() {
    Peasant peasant = new Peasant(1900, "Peasant");

    Set<ConstraintViolation<Peasant>> constraintViolations =
        validator.validate(peasant);

    assertEquals(1, constraintViolations.size());
    assertEquals(
        "must be greater than or equal to 2000",
        constraintViolations.iterator().next().getMessage()
    );
  }

  @Test
  public void nameNotBlank() {
    Peasant peasant = new Peasant(2000, "");

    Set<ConstraintViolation<Peasant>> constraintViolations =
        validator.validate(peasant);

    assertEquals(1, constraintViolations.size());
    assertEquals(
        "may not be empty",
        constraintViolations.iterator().next().getMessage()
    );
  }

  @Test
  public void peasantIsValid() {
    Peasant peasant = new Peasant(2000, "Peasant");

    Set<ConstraintViolation<Peasant>> constraintViolations =
        validator.validate(peasant);

    assertEquals(0, constraintViolations.size());
  }
}
package com.gingerik.bzv.model;

import lombok.Data;
import org.hibernate.validator.constraints.NotEmpty;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.AssertTrue;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.util.Date;

@Data
@Entity
public class Period {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  @Min(2000)
  private int year;

  @NotNull
  private Date start;

  @NotNull
  private Date end;

  private Date reference;

  @Min(1)
  @Max(5)
  private int numberOfVotes;

  private Period() {
  }

  public Period(int year, Date start, Date end, Date reference, int numberOfVotes) {
    this.year = year;
    this.start = start;
    this.end = end;
    this.reference = reference;
    this.numberOfVotes = numberOfVotes;
  }

  @AssertTrue(message="period dates should be valid")
  private boolean isValid() {
    return this.end.after(this.start) &&
        (this.reference == null || this.reference.after(this.end));
  }

}
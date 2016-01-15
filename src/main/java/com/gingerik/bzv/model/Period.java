package com.gingerik.bzv.model;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.AssertTrue;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

@Entity
public class Period {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  @Min(2000)
  private int year;

  @NotNull
  private LocalDateTime start;

  @NotNull
  private LocalDateTime end;

  private LocalDateTime reference;

  @Min(1)
  @Max(5)
  private int numberOfVotes;

  private Set<Vote> votes = new HashSet<Vote>();

  private Period() {
  }

  /**
   * Create a new Period.
   * @param year Year of season
   * @param start Start date
   * @param end End date
   * @param reference Reference date, to check on dropped candidates
   * @param numberOfVotes The number of votes users have this period
   */
  public Period(int year, LocalDateTime start, LocalDateTime end,
                LocalDateTime reference, int numberOfVotes) {
    this.year = year;
    this.start = start;
    this.end = end;
    this.reference = reference;
    this.numberOfVotes = numberOfVotes;
  }

  @AssertTrue(message = "period dates should be valid")
  private boolean isValid() {
    return end.isAfter(start)
        && (reference == null || reference.isAfter(end));
  }

  public void setYear(int year) {
    this.year = year;
  }

  public int getYear() {
    return year;
  }

  public void setStart(LocalDateTime start) {
    this.start = start;
  }

  public LocalDateTime getStart() {
    return start;
  }

  public void setEnd(LocalDateTime end) {
    this.end = end;
  }

  public LocalDateTime getEnd() {
    return end;
  }

  public void setReference(LocalDateTime reference) {
    this.reference = reference;
  }

  public LocalDateTime getReference() {
    return reference;
  }

  public void setNumberOfVotes(int numberOfVotes) {
    this.numberOfVotes = numberOfVotes;
  }

  public int getNumberOfVotes() {
    return numberOfVotes;
  }

  private void setVotes(Set<Vote> votes) {
    this.votes = votes;
  }

  public Set<Vote> getVotes() {
    return votes;
  }

  /**
   * Create a bidirectional link with Vote.
   * @param vote Vote
   */
  public void addVote(Vote vote) {
    if (vote == null) {
      throw new NullPointerException("vote cannot be null");
    }
    if (vote.getPeriod() != null) {
      throw new IllegalStateException("vote is already assigned to a period");
    }
    getVotes().add(vote);
    vote.setPeriod(this);
  }
}
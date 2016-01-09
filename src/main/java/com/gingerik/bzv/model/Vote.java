package com.gingerik.bzv.model;

import org.apache.log4j.Logger;
import org.springframework.data.rest.core.annotation.RestResource;

import javax.persistence.*;
import javax.validation.constraints.AssertTrue;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
public class Vote {

  public enum Type {
    LOVE,
    GOOD,
    BAD
  }

  private static final Logger log = Logger.getLogger(Vote.class);

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  @ManyToOne
  @RestResource(exported = false)
  @NotNull
  private User user;

  @ManyToOne
  @RestResource(exported = false)
  @NotNull
  private Candidate candidate;

  @ManyToOne
  @RestResource(exported = false)
  @NotNull
  private Period period;

  @NotNull
  private Type type;

  @NotNull
  private LocalDateTime update;

  @Min(0)
  @Max(5)
  private int points;

  @Min(0)
  @Max(5)
  private int bonusPoints;

  @PrePersist
  public void onCreate() {
    update = LocalDateTime.now();
  }

  @PreUpdate
  protected void onUpdate() {
    update = LocalDateTime.now();
  }

  private Vote() {
  }

  public Vote(User user, Candidate candidate, Period period, Type type) {
    this.user = user;
    this.candidate = candidate;
    this.period = period;
    this.type = type;
    this.points = 0;
    this.bonusPoints = 0;
    this.update = LocalDateTime.now();
  }

  @AssertTrue(message = "vote should be within the period")
  private boolean isWithinPeriod() {
    return update == null || period == null ||
        update.isAfter(period.getStart()) && update.isBefore(period.getEnd());
  }

  @AssertTrue(message = "candidate should not be dropped")
  private boolean isValidCandidate() {
    return candidate == null || candidate.getDropped() == null;
  }

  @AssertTrue(message = "points must not exceed number of candidates")
  private boolean isValidPoints() {
    return period == null || this.points <= period.getNumberOfVotes() * 2 + 1;
  }

  @AssertTrue(message = "bonusPoints must not exceed number of candidates")
  private boolean isValidBonusPoints() {
    return period == null || this.bonusPoints == 0 ||
        this.bonusPoints == period.getNumberOfVotes();
  }

  public void setType(Type type) {
    this.type = type;
  }

  public User getUser() {
    return user;
  }

  public Candidate getCandidate() {
    return candidate;
  }

  public Period getPeriod() {
    return period;
  }

  public Type getType() {
    return type;
  }

  public int getPoints() {
    return points;
  }

  public int getBonusPoints() {
    return bonusPoints;
  }
}
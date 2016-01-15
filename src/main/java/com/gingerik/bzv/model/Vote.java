package com.gingerik.bzv.model;

import org.apache.log4j.Logger;
import org.springframework.data.rest.core.annotation.RestResource;

import java.time.LocalDateTime;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.validation.constraints.AssertTrue;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

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

  /**
   * Create a new Vote.
   * @param user User that votes
   * @param candidate Candidate that is being voted for
   * @param period Period of vote
   * @param type Type of vote
   */
  public Vote(User user, Candidate candidate, Period period, Type type) {
    user.addVote(this);
    candidate.addVote(this);
    period.addVote(this);
    this.type = type;
    this.points = 0;
    this.bonusPoints = 0;
    this.update = LocalDateTime.now();
  }

  @AssertTrue(message = "vote should be within the period")
  private boolean isWithinPeriod() {
    return update == null || period == null
        || update.isAfter(period.getStart()) && update.isBefore(period.getEnd());
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
    return period == null || this.bonusPoints == 0 || this.bonusPoints == period.getNumberOfVotes();
  }

  public void setUser(User user) {
    this.user = user;
  }

  public User getUser() {
    return user;
  }

  public void setCandidate(Candidate candidate) {
    this.candidate = candidate;
  }

  public Candidate getCandidate() {
    return candidate;
  }

  public void setPeriod(Period period) {
    this.period = period;
  }

  public Period getPeriod() {
    return period;
  }

  public void setType(Type type) {
    this.type = type;
  }

  public Type getType() {
    return type;
  }

  public void setPoints(int points) {
    this.points = points;
  }

  public int getPoints() {
    return points;
  }

  public void setBonusPoints(int bonusPoints) {
    this.bonusPoints = bonusPoints;
  }

  public int getBonusPoints() {
    return bonusPoints;
  }
}
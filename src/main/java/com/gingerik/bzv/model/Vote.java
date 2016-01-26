package com.gingerik.bzv.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.apache.log4j.Logger;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;
import javax.persistence.Entity;
import javax.persistence.Enumerated;
import javax.persistence.EnumType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Transient;
import javax.validation.constraints.AssertTrue;
import javax.validation.constraints.NotNull;

@Entity
public class Vote implements Serializable {

  public enum Type {
    LOVE,
    GOOD,
    BAD
  }

  private static final Logger log = Logger.getLogger(Vote.class);

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  @NotNull
  @ManyToOne
  private User user;

  @NotNull
  @ManyToOne
  private Candidate candidate;

  @NotNull
  @ManyToOne
  private Period period;

  @NotNull
  @Enumerated(EnumType.STRING)
  private Type type;

  @NotNull
  @Temporal(TemporalType.TIMESTAMP)
  private LocalDateTime update;

  @JsonIgnore
  @Transient
  private boolean disabledCache;

  @Transient
  private Integer points;

  @Transient
  private Integer bonusPoints;

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
    if (user != null) {
      user.addVote(this);
    }
    if (candidate != null) {
      candidate.addVote(this);
    }
    if (period != null) {
      period.addVote(this);
    }
    this.type = type;
    this.update = LocalDateTime.now();
    this.disabledCache = true;
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
    return period == null || points == null || points <= period.getNumberOfVotes() * 2 + 1;
  }

  @AssertTrue(message = "bonusPoints must not exceed number of candidates")
  private boolean isValidBonusPoints() {
    return period == null || bonusPoints == null
        || bonusPoints == 0 || bonusPoints == period.getNumberOfVotes();
  }

  public User getUser() {
    return user;
  }

  public void setUser(User user) {
    this.user = user;
  }

  public Candidate getCandidate() {
    return candidate;
  }

  public void setCandidate(Candidate candidate) {
    this.candidate = candidate;
  }

  public Period getPeriod() {
    return period;
  }

  public void setPeriod(Period period) {
    this.period = period;
  }

  public Type getType() {
    return type;
  }

  public void setType(Type type) {
    this.type = type;
  }

  /**
   * Get points earned with this vote.
   * @return Number of points
   */
  public int getPoints() {
    synchronized (this) {
      if (points == null || disabledCache) {
        points = 0;
        Period period = getPeriod();
        LocalDateTime reference = period.getReference();
        if (reference != null) {
          LocalDateTime dropped = getCandidate().getDropped();
          if (dropped == null) {
            if (!Type.BAD.equals(type)) {
              if (LocalDateTime.now().isAfter(reference)) {
                points = 1;
              }
            }
          } else {
            if (Type.BAD.equals(type)) {
              if (dropped.isAfter(period.getStart()) && dropped.isBefore(reference)) {
                points = 1;
              }
            }
          }
        }
      }
    }
    return points;
  }

  /**
   * Get bonus points earned with this vote.
   * @return Number of bonus points
   */
  public int getBonusPoints() {
    synchronized (this) {
      if (bonusPoints == null || disabledCache) {
        bonusPoints = 0;
        if (Type.LOVE.equals(type)) {
          if (candidate.isLover()) {
            bonusPoints = getPeriod().getNumberOfVotes();
          }
        } else {
          Peasant peasant = candidate.getPeasant();
          Candidate lover = peasant.getLover().orElse(null);
          if (lover != null && !peasant.getCandidates().contains(lover)) {
            Set<Vote> loveVotes = period.getVotes().stream()
                .filter(v -> v.getUser().equals(user))
                .filter(v -> Type.LOVE.equals(v.type))
                .collect(Collectors.toSet());
            if (loveVotes.size() == 0) {
              bonusPoints = 1;
            }
          }
        }
      }
    }
    return bonusPoints;
  }
}
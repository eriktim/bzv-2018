package com.gingerik.bzv.model;

import lombok.Data;
import org.apache.log4j.Logger;
import org.springframework.data.rest.core.annotation.RestResource;

import javax.persistence.*;
import javax.validation.constraints.AssertTrue;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.util.Date;

@Data
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
  private Date update;

  @Transient
  @Min(0)
  @Max(5)
  private int points;

  @Transient
  @Min(0)
  @Max(5)
  private int bonusPoints;

  @PrePersist
  public void onCreate() {
    update = new Date();
  }

  @PreUpdate
  protected void onUpdate() {
    update = new Date();
  }

  private Vote() {
  }

  public Vote(User user, Candidate candidate, Period period, Type type) {
    this.user = user;
    this.candidate = candidate;
    this.period = period;
    this.type = type;
    this.update = new Date();
    this.points = 0;
    this.bonusPoints = 0;
  }

}
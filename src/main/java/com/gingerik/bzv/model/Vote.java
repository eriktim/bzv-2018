package com.gingerik.bzv.model;

import lombok.Data;
import org.apache.log4j.Logger;
import org.springframework.data.rest.core.annotation.RestResource;

import javax.persistence.*;
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
  private User user;

  @ManyToOne
  @RestResource(exported = false)
  private Candidate candidate;

  @ManyToOne
  @RestResource(exported = false)
  private Period period;

  private Type type;

  private Date update;

  @Transient
  private int points;

  @Transient
  private int bonusPoints;

  private Vote() {
  }

  public Vote(User user, Candidate candidate, Period period, Type type) {
    this.user = user;
    this.candidate = candidate;
    this.period = period;
    this.type = type;
    this.update = new Date();
  }
}
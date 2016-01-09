package com.gingerik.bzv.model;

import org.hibernate.validator.constraints.NotBlank;
import org.springframework.data.rest.core.annotation.RestResource;

import java.time.LocalDateTime;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

@Entity
public class Candidate {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  @ManyToOne
  @RestResource(exported = false)
  @NotNull
  private Peasant peasant;

  @NotBlank
  private String name;

  private LocalDateTime dropped;

  private Candidate() {
  }

  public Candidate(Peasant peasant, String name) {
    this.peasant = peasant;
    this.name = name;
  }

  /**
   * Create a new Candidate.
   * @param peasant Peasant
   * @param name Name
   * @param dropped Date to indicate when the Peasant dropped this candidate (optional)
   */
  public Candidate(Peasant peasant, String name, LocalDateTime dropped) {
    this.peasant = peasant;
    this.name = name;
    this.dropped = dropped;
  }

  public void setDropped(LocalDateTime dropped) {
    this.dropped = dropped;
  }

  public Peasant getPeasant() {
    return peasant;
  }

  public String getName() {
    return name;
  }

  public LocalDateTime getDropped() {
    return dropped;
  }
}
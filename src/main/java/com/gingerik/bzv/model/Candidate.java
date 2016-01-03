package com.gingerik.bzv.model;

import org.hibernate.validator.constraints.NotBlank;
import org.springframework.data.rest.core.annotation.RestResource;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

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
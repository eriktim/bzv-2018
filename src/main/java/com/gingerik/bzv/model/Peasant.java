package com.gingerik.bzv.model;

import java.io.Serializable;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Transient;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Entity
public class Peasant implements Serializable {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  @Min(2000)
  private int year;

  @NotNull
  @Size(min = 2, max = 255)
  private String name;

  @OneToMany
  private Set<Candidate> candidates = new HashSet<Candidate>();

  @Transient
  private Optional<Candidate> lover;

  private Peasant() {
  }

  /**
   * Create a new Peasant.
   *
   * @param year Year of season
   * @param name Name
   */
  public Peasant(int year, String name) {
    this.year = year;
    this.name = name;
  }

  public int getYear() {
    return year;
  }

  public void setYear(int year) {
    this.year = year;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  // TODO unmodifiable set (pp 44)
  public Set<Candidate> getCandidates() {
    return candidates;
  }

  private void setCandidates(Set<Candidate> candidates) {
    this.candidates = candidates;
  }

  /**
   * Create a bidirectional link with Candidate.
   * @param candidate Candidate
   */
  public void addCandidate(Candidate candidate) {
    if (candidate == null) {
      throw new NullPointerException("candidate cannot be null");
    }
    if (candidate.getPeasant() != null) {
      throw new IllegalStateException("candidate is already assigned to a peasant");
    }
    getCandidates().add(candidate);
    candidate.setPeasant(this);
  }

  Optional<Candidate> getLover() {
    synchronized (this) {
      if (lover == null) {
        Set<Candidate> candidatesInTheRunning =
            candidates.stream().filter(c -> c.getDropped() == null).collect(Collectors.toSet());
        if (candidatesInTheRunning.size() > 0) {
          lover = candidatesInTheRunning.size() == 1
              ? Optional.of(candidatesInTheRunning.iterator().next()) : Optional.empty();
        } else {
          lover = Optional.of(new Candidate("<UnknownLover>", null));
        }
      }
    }
    return lover;
  }

}
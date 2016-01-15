package com.gingerik.bzv.model;

import org.hibernate.validator.constraints.NotBlank;
import org.springframework.data.rest.core.annotation.RestResource;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
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

  private Set<Vote> votes = new HashSet<Vote>();

  private Candidate() {
  }

  public Candidate(String name, Peasant peasant) {
    this.name = name;
    peasant.addCandidate(this);
  }

  /**
   * Create a new Candidate.
   *
   * @param name    Name
   * @param peasant Peasant
   * @param dropped Date to indicate when the Peasant dropped this candidate (optional)
   */
  public Candidate(String name, Peasant peasant, LocalDateTime dropped) {
    this.name = name;
    peasant.addCandidate(this);
    this.dropped = dropped;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getName() {
    return name;
  }

  void setPeasant(Peasant peasant) {
    this.peasant = peasant;
  }

  public Peasant getPeasant() {
    return peasant;
  }

  public void setDropped(LocalDateTime dropped) {
    this.dropped = dropped;
  }

  public LocalDateTime getDropped() {
    return dropped;
  }

  private void setVotes(Set<Vote> votes) {
    this.votes = votes;
  }

  // TODO unmodifiable set (pp 44)
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
    if (vote.getCandidate() != null) {
      throw new IllegalStateException("vote is already assigned to a candidate");
    }
    getVotes().add(vote);
    vote.setCandidate(this);
  }

}
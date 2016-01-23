package com.gingerik.bzv.model;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Entity
public class Candidate implements Serializable {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  private String name;

  @ManyToOne
  private Peasant peasant;

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

  @NotNull
  @Size(min = 2, max = 255)
  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  @NotNull
  public Peasant getPeasant() {
    return peasant;
  }

  void setPeasant(Peasant peasant) {
    this.peasant = peasant;
  }

  public LocalDateTime getDropped() {
    return dropped;
  }

  public void setDropped(LocalDateTime dropped) {
    this.dropped = dropped;
  }

  // TODO unmodifiable set (pp 44)
  public Set<Vote> getVotes() {
    return votes;
  }

  private void setVotes(Set<Vote> votes) {
    this.votes = votes;
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
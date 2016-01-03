package com.gingerik.bzv.model;

import lombok.Data;
import org.springframework.data.rest.core.annotation.RestResource;

import javax.persistence.*;
import java.util.Date;

@Data
@Entity
public class Candidate {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  @ManyToOne
  @RestResource(exported = false)
  private Peasant peasant;

  private String name;

  @Column(nullable = true)
  private Date dropped;

  private Candidate() {
  }

  public Candidate(Peasant peasant, String name) {
    this.peasant = peasant;
    this.name = name;
  }
}
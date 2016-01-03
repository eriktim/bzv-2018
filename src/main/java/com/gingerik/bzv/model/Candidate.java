package com.gingerik.bzv.model;

import lombok.Data;
import org.hibernate.validator.constraints.NotBlank;
import org.springframework.data.rest.core.annotation.RestResource;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;

@Data
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

  private Date dropped;

  private Candidate() {
  }

  public Candidate(Peasant peasant, String name) {
    this.peasant = peasant;
    this.name = name;
  }

  public Candidate(Peasant peasant, String name, Date dropped) {
    this.peasant = peasant;
    this.name = name;
    this.dropped = dropped;
  }
}
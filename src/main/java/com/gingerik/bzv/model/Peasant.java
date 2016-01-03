package com.gingerik.bzv.model;

import lombok.Data;
import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.Min;

@Data
@Entity
public class Peasant {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  @Min(2000)
  private int year;

  @NotBlank
  private String name;

  private Peasant() {
  }

  public Peasant(int year, String name) {
    this.year = year;
    this.name = name;
  }

}
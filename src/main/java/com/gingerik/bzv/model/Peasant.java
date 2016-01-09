package com.gingerik.bzv.model;

import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.Min;

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

  /**
   * Create a new Peasant.
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

  public String getName() {
    return name;
  }

}
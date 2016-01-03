package com.gingerik.bzv.model;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Data
@Entity
public class Peasant {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  private int year;
  private String name;

  private Peasant() {
  }

  public Peasant(int year, String name) {
    this.year = year;
    this.name = name;
  }

}
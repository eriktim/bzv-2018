package com.gingerik.bzv.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Data
@Entity
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  private int year;
  private String name;
  private String email;

  @JsonIgnore
  private String hash;

  private User() {
  }

  public User(int year, String name, String email, String hash) {
    this.year = year;
    this.name = name;
    this.email = email;
    this.hash = hash;
  }
}

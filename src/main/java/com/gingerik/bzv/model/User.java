package com.gingerik.bzv.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.Min;
import javax.validation.constraints.Size;

@Entity
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  @Min(2000)
  private int year;

  @NotBlank
  private String name;

  @Email
  @NotBlank
  private String email;

  @JsonIgnore
  @NotBlank
  @Size(min = 60, max = 60)
  // TODO regex
  // TODO setter, i.e. password -> hash
  private String hash;

  private User() {
  }

  public User(int year, String name, String email, String hash) {
    this.year = year;
    this.name = name;
    this.email = email;
    setHash(hash);
  }

  public void setHash(String hash) {
    this.hash = hash;
  }

  public int getYear() {
    return year;
  }

  public String getName() {
    return name;
  }

  public String getEmail() {
    return email;
  }
}

package com.gingerik.bzv.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.NotBlank;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.Min;
import javax.validation.constraints.Size;

@Data
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
    this.hash = hash;
  }
}

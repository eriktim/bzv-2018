package com.gingerik.bzv.model;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.util.Date;

@Data
@Entity
public class Period {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  private int year;

  private Date start;

  private Date end;

  private Date reference;

  private int numberOfVotes;

  private Period() {
  }

  public Period(int year, Date start, Date end, Date reference, int numberOfVotes) {
    this.year = year;
    this.start = start;
    this.end = end;
    this.reference = reference;
    this.numberOfVotes = numberOfVotes;
  }
}
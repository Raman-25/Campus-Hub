package com.example.collegeManagementSystem.collage.Enum;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum Department {
    @JsonProperty("Computer Science") COMPUTER_SCIENCE,
    @JsonProperty("Electronics & Communication") ELECTRONICS,
    @JsonProperty("Mechanical Engineering") MECHANICAL,
    @JsonProperty("Civil Engineering") CIVIL,
    @JsonProperty("Electrical Engineering") ELECTRICAL
}


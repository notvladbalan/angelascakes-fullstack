package com.example.angelascakes.dto;

import lombok.Data;

@Data
public class UserProfileDTO {
    private Long id;
    private String email;
    private String role;
    private String firstName;
    private String lastName;
    private String addressLine;
    private String buildingName;
    private String streetName;
    private String postcode;
    private String city;
}
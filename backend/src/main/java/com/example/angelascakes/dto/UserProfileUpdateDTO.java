package com.example.angelascakes.dto;

import lombok.Data;

@Data
public class UserProfileUpdateDTO {
    private String firstName;
    private String lastName;
    private String addressLine;
    private String buildingName;
    private String streetName;
    private String postcode;
    private String city;
}
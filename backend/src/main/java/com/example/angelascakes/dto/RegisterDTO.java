package com.example.angelascakes.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterDTO {

    @NotBlank(message = "Email nesmí být prázdný")
    @Email(message = "Neplatný formát emailu")
    private String email;

    @NotBlank(message = "Heslo nesmí být prázdné")
    @Size(min = 8, message = "Heslo musí mít alespoň 8 znaků")
    private String password;
}
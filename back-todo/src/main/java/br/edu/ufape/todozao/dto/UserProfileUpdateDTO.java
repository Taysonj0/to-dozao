package br.edu.ufape.todozao.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserProfileUpdateDTO(
        @NotBlank String name,
        @Email @NotBlank String email,
        @Size(max = 255) String headline,
        @Size(max = 2000) String bio,
        @Size(max = 120) String location
) {
}

package br.edu.ufape.todozao.dto;

import br.edu.ufape.todozao.model.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegisterDTO(

        @NotBlank
        String name,

        @Email
        @NotBlank
        String email,

        @NotBlank
        String login,

        @NotBlank
        String password,

        UserRole role
) {
}
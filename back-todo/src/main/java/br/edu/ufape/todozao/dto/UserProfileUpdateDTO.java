package br.edu.ufape.todozao.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserProfileUpdateDTO(
        @NotBlank(message = "Informe o nome.")
        @Size(max = 80, message = "O nome deve ter no máximo 80 caracteres.")
        String name,
        @Email(message = "Informe um e-mail válido.")
        @NotBlank(message = "Informe o e-mail.")
        @Size(max = 100, message = "O e-mail deve ter no máximo 100 caracteres.")
        String email,
        @Size(max = 120, message = "A apresentação deve ter no máximo 120 caracteres.")
        String headline,
        @Size(max = 2000) String bio,
        @Size(max = 50, message = "A localização deve ter no máximo 50 caracteres.")
        String location
) {
}

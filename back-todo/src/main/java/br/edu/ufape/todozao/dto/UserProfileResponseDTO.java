package br.edu.ufape.todozao.dto;

public record UserProfileResponseDTO(
        Long id,
        String name,
        String email,
        String login,
        String headline,
        String bio,
        String location
) {
}

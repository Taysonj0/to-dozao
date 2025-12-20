package br.edu.ufape.todozao.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class NotificationCreateDTO {
    @NotBlank
    private String title;

    @NotBlank
    private String message;

    @NotNull
    private Long taskId;
}

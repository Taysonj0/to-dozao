package br.edu.ufape.todozao.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SubtaskCreateDTO {
    @NotBlank
    private String title;

    @NotNull
    private Long taskId;
}

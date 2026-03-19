package br.edu.ufape.todozao.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskDTO {
    private Long id;

    @NotBlank(message = "O título é obrigatório.")
    @Size(min = 3, max = 50, message = "O título deve ter entre 3 e 50 caracteres.")
    private String title;

    @Size(max = 255, message = "A descrição deve ter no máximo 255 caracteres.")
    private String description;

    private String color;
    private String priority;
    private String taskStatus;
    private String dueDate;
    private String type;
    private String resetRule;
    private Long tagId;
    private String tagName;
    private String tagColor;
    private Long userId;
    private Long projectId;

}
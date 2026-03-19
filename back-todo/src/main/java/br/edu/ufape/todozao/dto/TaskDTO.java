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

    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 255, message = "Title must be between 3 and 255 characters")
    private String title;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
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
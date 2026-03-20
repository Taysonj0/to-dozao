package br.edu.ufape.todozao.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TaskDependencyResponseDTO {
    private Long id;
    private Long taskId;
    private Long dependsOnId;
}
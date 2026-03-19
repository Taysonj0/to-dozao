package br.edu.ufape.todozao.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ProjectWithTasksDTO {
    private Long id;
    private String name;
    private String color;
    private List<TaskDTO> tasks;
}
package br.edu.ufape.todozao.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import br.edu.ufape.todozao.dto.TaskDependencyCreateDTO;
import br.edu.ufape.todozao.model.Task;
import br.edu.ufape.todozao.service.TaskDependencyService;

@RestController
@RequestMapping("/task-dependencies")
public class TaskDependencyController {

    private final TaskDependencyService service;

    public TaskDependencyController(TaskDependencyService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void criar(@RequestBody TaskDependencyCreateDTO dto) {

        Task task = new Task();
        task.setId(dto.getTaskId());

        Task dependsOn = new Task();
        dependsOn.setId(dto.getDependsOnId());

        service.adicionarDependencia(task, dependsOn);
    }
}

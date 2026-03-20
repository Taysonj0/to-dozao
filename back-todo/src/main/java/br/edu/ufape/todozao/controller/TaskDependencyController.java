package br.edu.ufape.todozao.controller;

import br.edu.ufape.todozao.dto.TaskDependencyCreateDTO;
import br.edu.ufape.todozao.model.Task;
import br.edu.ufape.todozao.model.TaskDependency;
import br.edu.ufape.todozao.repository.TaskRepository;
import br.edu.ufape.todozao.service.TaskDependencyService;

import br.edu.ufape.todozao.service.TaskService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import br.edu.ufape.todozao.dto.TaskDependencyCreateDTO;
import br.edu.ufape.todozao.model.Task;
import br.edu.ufape.todozao.service.TaskDependencyService;
import br.edu.ufape.todozao.service.TaskService;

@RestController
@RequestMapping("/api/task-dependencies")
@CrossOrigin(origins = "*")
public class TaskDependencyController {

    private final TaskDependencyService service;
    private final TaskService taskService;

    public TaskDependencyController(TaskDependencyService service,
                                    TaskService taskService) {
        this.service = service;
        this.taskService = taskService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void criar(@RequestBody TaskDependencyCreateDTO dto) {

        Task task = taskService.findEntityById(dto.getTaskId());
        Task dependsOn = taskService.findEntityById(dto.getDependsOnId());

        service.adicionarDependencia(task, dependsOn);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remover(@PathVariable Long id) {
        service.remover(id);
    }
}
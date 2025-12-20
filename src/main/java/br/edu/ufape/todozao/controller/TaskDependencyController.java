package br.edu.ufape.todozao.controller;

<<<<<<< HEAD
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestBody;
=======
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

>>>>>>> 7fce0fa2143972aba849ba28126864c0abb520ab

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

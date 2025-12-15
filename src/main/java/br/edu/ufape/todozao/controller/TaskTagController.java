package br.edu.ufape.todozao.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import br.edu.ufape.todozao.model.TaskTag;
import br.edu.ufape.todozao.service.TaskTagService;

@RestController
@RequestMapping("/task-tags")
public class TaskTagController {

    private final TaskTagService service;

    public TaskTagController(TaskTagService service) {
        this.service = service;
    }

    @GetMapping
    public List<TaskTag> listar() {
        return service.listarTodos();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TaskTag criar(@RequestBody TaskTag taskTag) {
        return service.salvar(taskTag);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void remover(@PathVariable Long id) {
        service.remover(id);
    }
}

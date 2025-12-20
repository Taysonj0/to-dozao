package br.edu.ufape.todozao.controller;

import br.edu.ufape.todozao.dto.SubtaskCreateDTO;
import br.edu.ufape.todozao.dto.SubtaskResponseDTO;
import br.edu.ufape.todozao.service.SubtaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subtasks")
public class SubtaskController {

    private final SubtaskService service;

    public SubtaskController(SubtaskService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SubtaskResponseDTO create(@RequestBody @Valid SubtaskCreateDTO dto) {
        return service.create(dto);
    }

    @GetMapping("/{id}")
    public SubtaskResponseDTO getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping("/task/{taskId}")
    public List<SubtaskResponseDTO> findByTask(@PathVariable Long taskId) {
        return service.findByTaskId(taskId);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}

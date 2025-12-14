package br.edu.ufape.todozao.controller;

import br.edu.ufape.todozao.model.Subtask;
import br.edu.ufape.todozao.service.SubtaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/subtasks")
public class SubtaskController {
    private final SubtaskService service;

    public SubtaskController(SubtaskService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Subtask> create(@Valid @RequestBody Subtask subtask) {
        Subtask saved = service.save(subtask);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping
    public ResponseEntity<List<Subtask>> findAll() {
        List<Subtask> subtasks = service.findAll();
        return ResponseEntity.ok(subtasks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Subtask> findById(@PathVariable Long id) {
        Optional<Subtask> subtask = service.findById(id);
        return subtask.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/task/{taskId}")
    public ResponseEntity<List<Subtask>> findByTaskId(@PathVariable Long taskId) {
        List<Subtask> subtasks = service.findByTaskId(taskId);
        return ResponseEntity.ok(subtasks);
    }

    @GetMapping("/task/{taskId}/completed/{completed}")
    public ResponseEntity<List<Subtask>> findByTaskIdAndCompleted(
            @PathVariable Long taskId,
            @PathVariable boolean completed) {
        List<Subtask> subtasks = service.findByTaskIdAndCompleted(taskId, completed);
        return ResponseEntity.ok(subtasks);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Subtask> update(@PathVariable Long id, @Valid @RequestBody Subtask subtask) {
        try {
            Subtask updated = service.update(id, subtask);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}


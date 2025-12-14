package br.edu.ufape.todozao.controller;

import br.edu.ufape.todozao.model.RecurrenceRule;
import br.edu.ufape.todozao.service.RecurrenceRuleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/recurrence-rules")
public class RecurrenceRuleController {
    private final RecurrenceRuleService service;

    public RecurrenceRuleController(RecurrenceRuleService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<RecurrenceRule> create(@Valid @RequestBody RecurrenceRule recurrenceRule) {
        RecurrenceRule saved = service.save(recurrenceRule);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping
    public ResponseEntity<List<RecurrenceRule>> findAll() {
        List<RecurrenceRule> rules = service.findAll();
        return ResponseEntity.ok(rules);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecurrenceRule> findById(@PathVariable Long id) {
        Optional<RecurrenceRule> rule = service.findById(id);
        return rule.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/task/{taskId}")
    public ResponseEntity<RecurrenceRule> findByTaskId(@PathVariable Long taskId) {
        Optional<RecurrenceRule> rule = service.findByTaskId(taskId);
        return rule.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecurrenceRule> update(@PathVariable Long id, @Valid @RequestBody RecurrenceRule recurrenceRule) {
        try {
            RecurrenceRule updated = service.update(id, recurrenceRule);
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


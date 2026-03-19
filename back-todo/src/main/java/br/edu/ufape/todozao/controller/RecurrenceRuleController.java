package br.edu.ufape.todozao.controller;

import br.edu.ufape.todozao.dto.RecurrenceRuleCreateDTO;
import br.edu.ufape.todozao.dto.RecurrenceRuleResponseDTO;
import br.edu.ufape.todozao.service.RecurrenceRuleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/recurrence-rules")
public class RecurrenceRuleController {

    private final RecurrenceRuleService service;

    public RecurrenceRuleController(RecurrenceRuleService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RecurrenceRuleResponseDTO create(@RequestBody @Valid RecurrenceRuleCreateDTO dto) {
        return service.create(dto);
    }

    @GetMapping("/{id}")
    public RecurrenceRuleResponseDTO getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
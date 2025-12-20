package br.edu.ufape.todozao.controller;

import br.edu.ufape.todozao.dto.NotificationCreateDTO;
import br.edu.ufape.todozao.dto.NotificationResponseDTO;
import br.edu.ufape.todozao.service.NotificationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService service;

    public NotificationController(NotificationService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public NotificationResponseDTO create(@RequestBody @Valid NotificationCreateDTO dto) {
        return service.create(dto);
    }

    @GetMapping("/{id}")
    public NotificationResponseDTO getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping("/task/{taskId}")
    public List<NotificationResponseDTO> findByTask(@PathVariable Long taskId) {
        return service.findByTaskId(taskId);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}

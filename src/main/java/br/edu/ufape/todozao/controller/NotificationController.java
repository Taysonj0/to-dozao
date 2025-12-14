package br.edu.ufape.todozao.controller;

import br.edu.ufape.todozao.model.Notification;
import br.edu.ufape.todozao.service.NotificationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    private final NotificationService service;

    public NotificationController(NotificationService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Notification> create(@Valid @RequestBody Notification notification) {
        Notification saved = service.save(notification);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping
    public ResponseEntity<List<Notification>> findAll() {
        List<Notification> notifications = service.findAll();
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Notification> findById(@PathVariable Long id) {
        Optional<Notification> notification = service.findById(id);
        return notification.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/task/{taskId}")
    public ResponseEntity<List<Notification>> findByTaskId(@PathVariable Long taskId) {
        List<Notification> notifications = service.findByTaskId(taskId);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/read/{read}")
    public ResponseEntity<List<Notification>> findByRead(@PathVariable boolean read) {
        List<Notification> notifications = service.findByRead(read);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/task/{taskId}/read/{read}")
    public ResponseEntity<List<Notification>> findByTaskIdAndRead(
            @PathVariable Long taskId,
            @PathVariable boolean read) {
        List<Notification> notifications = service.findByTaskIdAndRead(taskId, read);
        return ResponseEntity.ok(notifications);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Notification> update(@PathVariable Long id, @Valid @RequestBody Notification notification) {
        try {
            Notification updated = service.update(id, notification);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long id) {
        try {
            Notification notification = service.markAsRead(id);
            return ResponseEntity.ok(notification);
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


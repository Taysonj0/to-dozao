package br.edu.ufape.todozao.controller;

import br.edu.ufape.todozao.dto.TaskDTO;
import br.edu.ufape.todozao.model.TaskStatus;
import br.edu.ufape.todozao.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public ResponseEntity<TaskDTO> createTask(@Valid @RequestBody TaskDTO taskDTO, Authentication authentication) {
        TaskDTO createdTask = taskService.createTaskForUser(taskDTO, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskDTO> getTaskById(@PathVariable Long id, Authentication authentication) {
        TaskDTO taskDTO = taskService.getTaskByIdForUser(id, authentication.getName());
        return ResponseEntity.ok(taskDTO);
    }

    @GetMapping
    public ResponseEntity<List<TaskDTO>> getAllTasks(Authentication authentication) {
        List<TaskDTO> tasks = taskService.getTasksForUser(authentication.getName());
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TaskDTO>> getTasksByUserId(@PathVariable Long userId) {
        List<TaskDTO> tasks = taskService.getTasksByUserId(userId);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<TaskDTO>> getTasksByProjectId(@PathVariable Long projectId) {
        List<TaskDTO> tasks = taskService.getTasksByProjectId(projectId);
        return ResponseEntity.ok(tasks);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskDTO> updateTask(@PathVariable Long id, @Valid @RequestBody TaskDTO taskDTO, Authentication authentication) {
        TaskDTO updatedTask = taskService.updateTaskForUser(id, taskDTO, authentication.getName());
        return ResponseEntity.ok(updatedTask);
    }

    @PutMapping("/{id}/status/{status}")
    public ResponseEntity<TaskDTO> changeTaskStatus(@PathVariable Long id, @PathVariable TaskStatus status, Authentication authentication) {
        TaskDTO taskDTO = taskService.changeTaskStatusForUser(id, status, authentication.getName());
        return ResponseEntity.ok(taskDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id, Authentication authentication) {
        taskService.deleteTaskForUser(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
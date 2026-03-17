package br.edu.ufape.todozao.service;

import br.edu.ufape.todozao.dto.TaskDTO;
import br.edu.ufape.todozao.model.Task;
import br.edu.ufape.todozao.model.TaskStatus;
import br.edu.ufape.todozao.model.User;
import br.edu.ufape.todozao.model.Project;
import br.edu.ufape.todozao.repository.TagRepository;
import br.edu.ufape.todozao.repository.TaskRepository;
import br.edu.ufape.todozao.repository.TaskTagRepository;
import br.edu.ufape.todozao.repository.UserRepository;
import br.edu.ufape.todozao.repository.ProjectRepository;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@DisplayName("Task Service Tests")
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private TagRepository tagRepository;

    @Mock
    private TaskTagRepository taskTagRepository;

    @InjectMocks
    private TaskService taskService;

    private Validator validator;
    private TaskDTO validTaskDTO;
    private Task task;
    private User user;
    private Project project;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();

        user = User.builder()
                .id(1L)
                .name("Test User")
                .build();

        project = Project.builder()
                .id(1L)
                .name("Test Project")
                .build();

        validTaskDTO = TaskDTO.builder()
                .title("Valid Task Title")
                .description("This is a valid task description")
                .color("blue")
                .priority("HIGH")
                .dueDate("2024-12-31")
                .type("work")
                .userId(1L)
                .projectId(1L)
                .build();

        task = Task.builder()
                .id(1L)
                .title("Valid Task Title")
                .description("This is a valid task description")
                .color("blue")
                .priority("HIGH")
                .taskStatus(TaskStatus.PENDING)
                .dueDate("2024-12-31")
                .type("work")
                .user(user)
                .project(project)
                .build();
    }

    // ===== VALIDATION TESTS =====

    @Test
    @DisplayName("Should validate TaskDTO with all valid fields")
    void shouldValidateValidTaskDTO() {
        Set<ConstraintViolation<TaskDTO>> violations = validator.validate(validTaskDTO);
        assertTrue(violations.isEmpty(), "Valid TaskDTO should have no violations");
    }

    @Test
    @DisplayName("Should fail validation when title is blank")
    void shouldFailValidationWhenTitleIsBlank() {
        TaskDTO invalidTaskDTO = TaskDTO.builder()
                .title("")
                .description("Description")
                .build();

        Set<ConstraintViolation<TaskDTO>> violations = validator.validate(invalidTaskDTO);
        assertFalse(violations.isEmpty(), "Should have violations");
        assertTrue(violations.stream()
                        .anyMatch(v -> v.getPropertyPath().toString().equals("title")),
                "Should have title violation");
    }

    @Test
    @DisplayName("Should fail validation when title is null")
    void shouldFailValidationWhenTitleIsNull() {
        TaskDTO invalidTaskDTO = TaskDTO.builder()
                .title(null)
                .description("Description")
                .build();

        Set<ConstraintViolation<TaskDTO>> violations = validator.validate(invalidTaskDTO);
        assertFalse(violations.isEmpty(), "Should have violations");
        assertTrue(violations.stream()
                        .anyMatch(v -> v.getPropertyPath().toString().equals("title")),
                "Should have title violation");
    }

    @Test
    @DisplayName("Should fail validation when title is too short (less than 3 characters)")
    void shouldFailValidationWhenTitleIsTooShort() {
        TaskDTO invalidTaskDTO = TaskDTO.builder()
                .title("ab")
                .description("Description")
                .build();

        Set<ConstraintViolation<TaskDTO>> violations = validator.validate(invalidTaskDTO);
        assertFalse(violations.isEmpty(), "Should have violations");
        assertTrue(violations.stream()
                        .anyMatch(v -> v.getPropertyPath().toString().equals("title") &&
                                v.getMessage().contains("between 3 and 255")),
                "Should have title size violation");
    }

    @Test
    @DisplayName("Should fail validation when title exceeds max length (255 characters)")
    void shouldFailValidationWhenTitleIsTooLong() {
        String longTitle = "a".repeat(256);
        TaskDTO invalidTaskDTO = TaskDTO.builder()
                .title(longTitle)
                .description("Description")
                .build();

        Set<ConstraintViolation<TaskDTO>> violations = validator.validate(invalidTaskDTO);
        assertFalse(violations.isEmpty(), "Should have violations");
        assertTrue(violations.stream()
                        .anyMatch(v -> v.getPropertyPath().toString().equals("title") &&
                                v.getMessage().contains("between 3 and 255")),
                "Should have title size violation");
    }

    @Test
    @DisplayName("Should pass validation when title is exactly 3 characters")
    void shouldPassValidationWhenTitleIsMinimumLength() {
        TaskDTO taskDTO = TaskDTO.builder()
                .title("abc")
                .build();

        Set<ConstraintViolation<TaskDTO>> violations = validator.validate(taskDTO);
        assertTrue(violations.isEmpty(), "Valid title with 3 characters should pass");
    }

    @Test
    @DisplayName("Should pass validation when title is exactly 255 characters")
    void shouldPassValidationWhenTitleIsMaximumLength() {
        String maxTitle = "a".repeat(255);
        TaskDTO taskDTO = TaskDTO.builder()
                .title(maxTitle)
                .build();

        Set<ConstraintViolation<TaskDTO>> violations = validator.validate(taskDTO);
        assertTrue(violations.isEmpty(), "Valid title with 255 characters should pass");
    }

    @Test
    @DisplayName("Should fail validation when description exceeds max length (1000 characters)")
    void shouldFailValidationWhenDescriptionIsTooLong() {
        String longDescription = "a".repeat(1001);
        TaskDTO invalidTaskDTO = TaskDTO.builder()
                .title("Valid Title")
                .description(longDescription)
                .build();

        Set<ConstraintViolation<TaskDTO>> violations = validator.validate(invalidTaskDTO);
        assertFalse(violations.isEmpty(), "Should have violations");
        assertTrue(violations.stream()
                        .anyMatch(v -> v.getPropertyPath().toString().equals("description")),
                "Should have description violation");
    }

    @Test
    @DisplayName("Should pass validation when description is exactly 1000 characters")
    void shouldPassValidationWhenDescriptionIsMaximumLength() {
        String maxDescription = "a".repeat(1000);
        TaskDTO taskDTO = TaskDTO.builder()
                .title("Valid Title")
                .description(maxDescription)
                .build();

        Set<ConstraintViolation<TaskDTO>> violations = validator.validate(taskDTO);
        assertTrue(violations.isEmpty(), "Valid description with 1000 characters should pass");
    }

    @Test
    @DisplayName("Should pass validation when optional fields are null")
    void shouldPassValidationWhenOptionalFieldsAreNull() {
        TaskDTO taskDTO = TaskDTO.builder()
                .title("Valid Title")
                .description(null)
                .color(null)
                .priority(null)
                .build();

        Set<ConstraintViolation<TaskDTO>> violations = validator.validate(taskDTO);
        assertTrue(violations.isEmpty(), "Should pass with null optional fields");
    }

    // ===== SERVICE TESTS =====

    @Test
    @DisplayName("Should create task successfully with valid DTO")
    void shouldCreateTaskSuccessfully() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
        when(taskRepository.save(any(Task.class))).thenReturn(task);
        when(taskTagRepository.findByTaskId(1L)).thenReturn(Optional.empty());
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));

        TaskDTO result = taskService.createTask(validTaskDTO);

        assertNotNull(result);
        assertEquals("Valid Task Title", result.getTitle());
        assertEquals("HIGH", result.getPriority());
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    @DisplayName("Should get task by id successfully")
    void shouldGetTaskByIdSuccessfully() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));

        TaskDTO result = taskService.getTaskById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Valid Task Title", result.getTitle());
    }

    @Test
    @DisplayName("Should throw exception when task not found")
    void shouldThrowExceptionWhenTaskNotFound() {
        when(taskRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            taskService.getTaskById(999L);
        });
    }

    @Test
    @DisplayName("Should update task status successfully")
    void shouldUpdateTaskStatusSuccessfully() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        task.setTaskStatus(TaskStatus.COMPLETED);
        when(taskRepository.save(any(Task.class))).thenReturn(task);

        TaskDTO result = taskService.changeTaskStatus(1L, TaskStatus.COMPLETED);

        assertNotNull(result);
        assertEquals("COMPLETED", result.getTaskStatus());
    }

    @Test
    @DisplayName("Should delete task successfully")
    void shouldDeleteTaskSuccessfully() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));

        taskService.deleteTask(1L);

        verify(taskRepository, times(1)).delete(task);
    }
}
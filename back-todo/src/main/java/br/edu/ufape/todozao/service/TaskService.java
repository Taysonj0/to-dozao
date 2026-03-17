package br.edu.ufape.todozao.service;

import br.edu.ufape.todozao.dto.TaskDTO;
import br.edu.ufape.todozao.exception.InvalidTaskStatusException;
import br.edu.ufape.todozao.exception.TagNotFoundException;
import br.edu.ufape.todozao.exception.TaskNotFoundException;
import br.edu.ufape.todozao.exception.UnauthorizedTaskAccessException;
import br.edu.ufape.todozao.model.Tag;
import br.edu.ufape.todozao.model.Task;
import br.edu.ufape.todozao.model.TaskStatus;
import br.edu.ufape.todozao.model.TaskTag;
import br.edu.ufape.todozao.model.User;
import br.edu.ufape.todozao.repository.ProjectRepository;
import br.edu.ufape.todozao.repository.TagRepository;
import br.edu.ufape.todozao.repository.TaskRepository;
import br.edu.ufape.todozao.repository.TaskTagRepository;
import br.edu.ufape.todozao.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final TagRepository tagRepository;
    private final TaskTagRepository taskTagRepository;

    public TaskService(
            TaskRepository taskRepository,
            UserRepository userRepository,
            ProjectRepository projectRepository,
            TagRepository tagRepository,
            TaskTagRepository taskTagRepository
    ) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.tagRepository = tagRepository;
        this.taskTagRepository = taskTagRepository;
    }

    public TaskDTO createTask(TaskDTO taskDTO) {
        User owner = taskDTO.getUserId() != null
                ? userRepository.findById(taskDTO.getUserId()).orElse(null)
                : null;

        return createTaskInternal(taskDTO, owner);
    }

    public TaskDTO createTaskForUser(TaskDTO taskDTO, String login) {
        return createTaskInternal(taskDTO, resolveAuthenticatedUser(login));
    }

    private TaskDTO createTaskInternal(TaskDTO taskDTO, User owner) {
        Task task = new Task();
        task.setTitle(taskDTO.getTitle());
        task.setDescription(taskDTO.getDescription());
        task.setColor(taskDTO.getColor());
        task.setPriority(taskDTO.getPriority());
        task.setDueDate(taskDTO.getDueDate());
        task.setType(taskDTO.getType());
        task.setResetRule(taskDTO.getResetRule());
        task.setTaskStatus(parseTaskStatus(taskDTO.getTaskStatus(), TaskStatus.PENDING));
        task.setUser(owner);

        if (taskDTO.getProjectId() != null) {
            task.setProject(projectRepository.findById(taskDTO.getProjectId()).orElse(null));
        }

        Task savedTask = taskRepository.save(task);
        syncTaskTag(savedTask, taskDTO.getTagId());

        return convertToDTO(taskRepository.findById(savedTask.getId()).orElse(savedTask));
    }

    public TaskDTO updateTask(Long id, TaskDTO taskDTO) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(id));

        applyTaskUpdates(task, taskDTO);

        if (taskDTO.getUserId() != null) {
            task.setUser(userRepository.findById(taskDTO.getUserId()).orElse(null));
        }

        Task updatedTask = taskRepository.save(task);
        syncTaskTag(updatedTask, taskDTO.getTagId());

        return convertToDTO(taskRepository.findById(updatedTask.getId()).orElse(updatedTask));
    }

    public TaskDTO updateTaskForUser(Long id, TaskDTO taskDTO, String login) {
        User user = resolveAuthenticatedUser(login);
        Task task = findOwnedTask(id, user);

        applyTaskUpdates(task, taskDTO);
        task.setUser(user);

        Task updatedTask = taskRepository.save(task);
        syncTaskTag(updatedTask, taskDTO.getTagId());

        return convertToDTO(taskRepository.findById(updatedTask.getId()).orElse(updatedTask));
    }

    private void applyTaskUpdates(Task task, TaskDTO taskDTO) {
        task.setTitle(taskDTO.getTitle());
        task.setDescription(taskDTO.getDescription());
        task.setColor(taskDTO.getColor());
        task.setPriority(taskDTO.getPriority());
        task.setDueDate(taskDTO.getDueDate());
        task.setType(taskDTO.getType());
        task.setResetRule(taskDTO.getResetRule());
        task.setTaskStatus(parseTaskStatus(taskDTO.getTaskStatus(), task.getTaskStatus()));

        if (taskDTO.getProjectId() != null) {
            task.setProject(projectRepository.findById(taskDTO.getProjectId()).orElse(null));
        }
    }

    public TaskDTO getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(id));
        return convertToDTO(task);
    }

    public TaskDTO getTaskByIdForUser(Long id, String login) {
        return convertToDTO(findOwnedTask(id, resolveAuthenticatedUser(login)));
    }

    public List<TaskDTO> getAllTasks() {
        return taskRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TaskDTO> getTasksForUser(String login) {
        User user = resolveAuthenticatedUser(login);

        return taskRepository.findByUserId(user.getId())
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TaskDTO> getTasksByUserId(Long userId) {
        return taskRepository.findByUserId(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<TaskDTO> getTasksByProjectId(Long projectId) {
        return taskRepository.findByProjectId(projectId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(id));
        taskRepository.delete(task);
    }

    public void deleteTaskForUser(Long id, String login) {
        taskRepository.delete(findOwnedTask(id, resolveAuthenticatedUser(login)));
    }

    public TaskDTO changeTaskStatus(Long id, TaskStatus taskStatus) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new TaskNotFoundException(id));
        task.setTaskStatus(taskStatus);
        Task updatedTask = taskRepository.save(task);
        return convertToDTO(updatedTask);
    }

    public TaskDTO changeTaskStatusForUser(Long id, TaskStatus taskStatus, String login) {
        Task task = findOwnedTask(id, resolveAuthenticatedUser(login));
        task.setTaskStatus(taskStatus);
        Task updatedTask = taskRepository.save(task);
        return convertToDTO(updatedTask);
    }

    private TaskStatus parseTaskStatus(String rawStatus, TaskStatus fallback) {
        if (rawStatus == null || rawStatus.isBlank()) {
            return fallback;
        }

        try {
            return TaskStatus.valueOf(rawStatus.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new InvalidTaskStatusException(rawStatus);
        }
    }

    private User resolveAuthenticatedUser(String login) {
        User user = userRepository.findUserByLogin(login);

        if (user == null) {
            throw new UnauthorizedTaskAccessException();
        }

        return user;
    }

    private Task findOwnedTask(Long taskId, User user) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new TaskNotFoundException(taskId));

        if (task.getUser() == null || !task.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedTaskAccessException();
        }

        return task;
    }

    private void syncTaskTag(Task task, Long tagId) {
        Optional<TaskTag> existingAssociation = taskTagRepository.findByTaskId(task.getId());

        if (tagId == null) {
            existingAssociation.ifPresent(taskTagRepository::delete);
            return;
        }

        Tag tag = tagRepository.findById(tagId)
                .orElseThrow(TagNotFoundException::new);

        if (existingAssociation.isPresent()) {
            TaskTag taskTag = existingAssociation.get();

            if (taskTag.getTag().getId().equals(tagId)) {
                return;
            }

            taskTag.setTag(tag);
            taskTagRepository.save(taskTag);
            return;
        }

        taskTagRepository.save(TaskTag.builder()
                .task(task)
                .tag(tag)
                .build());
    }

    private TaskDTO convertToDTO(Task task) {
        TaskTag association = task.getTaskTags() == null || task.getTaskTags().isEmpty()
                ? null
                : task.getTaskTags().get(0);

        return TaskDTO.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .color(task.getColor())
                .priority(task.getPriority())
                .taskStatus(task.getTaskStatus().toString())
                .dueDate(task.getDueDate())
                .type(task.getType())
                .resetRule(task.getResetRule())
                .tagId(association != null ? association.getTag().getId() : null)
                .tagName(association != null ? association.getTag().getName() : null)
                .tagColor(association != null ? association.getTag().getColor() : null)
                .userId(task.getUser() != null ? task.getUser().getId() : null)
                .projectId(task.getProject() != null ? task.getProject().getId() : null)
                .build();
    }
}

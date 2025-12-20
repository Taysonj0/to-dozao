package br.edu.ufape.todozao.service;

import br.edu.ufape.todozao.dto.NotificationCreateDTO;
import br.edu.ufape.todozao.dto.NotificationResponseDTO;
import br.edu.ufape.todozao.exception.BadRequestException;
import br.edu.ufape.todozao.exception.NotificationNotFoundException;
import br.edu.ufape.todozao.model.Notification;
import br.edu.ufape.todozao.model.Task;
import br.edu.ufape.todozao.repository.NotificationRepository;
import br.edu.ufape.todozao.repository.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final TaskRepository taskRepository;

    public NotificationService(NotificationRepository notificationRepository, TaskRepository taskRepository) {
        this.notificationRepository = notificationRepository;
        this.taskRepository = taskRepository;
    }

    @Transactional
    public NotificationResponseDTO create(NotificationCreateDTO dto) {
        Task task = taskRepository.findById(dto.getTaskId())
                .orElseThrow(() -> new BadRequestException("Task not found: " + dto.getTaskId()));

        Notification n = new Notification();
        n.setTitle(dto.getTitle());
        n.setMessage(dto.getMessage());
        n.setRead(false);
        n.setTask(task);

        Notification saved = notificationRepository.save(n);

        return new NotificationResponseDTO(saved.getId(), saved.getTitle(), saved.getMessage(), saved.isRead(), saved.getCreatedAt(), saved.getTask() != null ? saved.getTask().getId() : null);
    }

    public NotificationResponseDTO getById(Long id) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new NotificationNotFoundException(id));
        return new NotificationResponseDTO(n.getId(), n.getTitle(), n.getMessage(), n.isRead(), n.getCreatedAt(), n.getTask() != null ? n.getTask().getId() : null);
    }

    public List<NotificationResponseDTO> findByTaskId(Long taskId) {
        List<Notification> list = notificationRepository.findByTaskId(taskId);
        return list.stream().map(n -> new NotificationResponseDTO(n.getId(), n.getTitle(), n.getMessage(), n.isRead(), n.getCreatedAt(), n.getTask() != null ? n.getTask().getId() : null)).collect(Collectors.toList());
    }

    @Transactional
    public void delete(Long id) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new NotificationNotFoundException(id));
        notificationRepository.delete(n);
    }
}

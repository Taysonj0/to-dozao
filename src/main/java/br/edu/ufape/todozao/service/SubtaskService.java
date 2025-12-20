package br.edu.ufape.todozao.service;

import br.edu.ufape.todozao.dto.SubtaskCreateDTO;
import br.edu.ufape.todozao.dto.SubtaskResponseDTO;
import br.edu.ufape.todozao.exception.BadRequestException;
import br.edu.ufape.todozao.exception.SubtaskNotFoundException;
import br.edu.ufape.todozao.model.Subtask;
import br.edu.ufape.todozao.model.Task;
import br.edu.ufape.todozao.repository.SubtaskRepository;
import br.edu.ufape.todozao.repository.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SubtaskService {

    private final SubtaskRepository subtaskRepository;
    private final TaskRepository taskRepository;

    public SubtaskService(SubtaskRepository subtaskRepository, TaskRepository taskRepository) {
        this.subtaskRepository = subtaskRepository;
        this.taskRepository = taskRepository;
    }

    @Transactional
    public SubtaskResponseDTO create(SubtaskCreateDTO dto) {
        Task task = taskRepository.findById(dto.getTaskId())
                .orElseThrow(() -> new BadRequestException("Task not found: " + dto.getTaskId()));

        Subtask s = Subtask.builder()
                .title(dto.getTitle())
                .completed(false)
                .createdAt(LocalDateTime.now().toString())
                .task(task)
                .build();

        Subtask saved = subtaskRepository.save(s);

        return new SubtaskResponseDTO(saved.getId(), saved.getTitle(), saved.isCompleted(), saved.getTask() != null ? saved.getTask().getId() : null);
    }

    public SubtaskResponseDTO getById(Long id) {
        Subtask s = subtaskRepository.findById(id)
                .orElseThrow(() -> new SubtaskNotFoundException(id));
        return new SubtaskResponseDTO(s.getId(), s.getTitle(), s.isCompleted(), s.getTask() != null ? s.getTask().getId() : null);
    }

    public List<SubtaskResponseDTO> findByTaskId(Long taskId) {
        List<Subtask> list = subtaskRepository.findByTaskId(taskId);
        return list.stream().map(s -> new SubtaskResponseDTO(s.getId(), s.getTitle(), s.isCompleted(), s.getTask() != null ? s.getTask().getId() : null)).collect(Collectors.toList());
    }

    @Transactional
    public void delete(Long id) {
        Subtask s = subtaskRepository.findById(id)
                .orElseThrow(() -> new SubtaskNotFoundException(id));
        subtaskRepository.delete(s);
    }
}

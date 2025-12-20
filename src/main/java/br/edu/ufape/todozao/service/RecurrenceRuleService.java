package br.edu.ufape.todozao.service;

import br.edu.ufape.todozao.dto.RecurrenceRuleCreateDTO;
import br.edu.ufape.todozao.dto.RecurrenceRuleResponseDTO;
import br.edu.ufape.todozao.exception.BadRequestException;
import br.edu.ufape.todozao.exception.RecurrenceRuleNotFoundException;
import br.edu.ufape.todozao.model.RecurrenceRule;
import br.edu.ufape.todozao.model.Task;
import br.edu.ufape.todozao.repository.RecurrenceRuleRepository;
import br.edu.ufape.todozao.repository.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class RecurrenceRuleService {

    private final RecurrenceRuleRepository recurrenceRuleRepository;
    private final TaskRepository taskRepository;

    public RecurrenceRuleService(RecurrenceRuleRepository recurrenceRuleRepository, TaskRepository taskRepository) {
        this.recurrenceRuleRepository = recurrenceRuleRepository;
        this.taskRepository = taskRepository;
    }

    @Transactional
    public RecurrenceRuleResponseDTO create(RecurrenceRuleCreateDTO dto) {
        Task task = taskRepository.findById(dto.getTaskId())
                .orElseThrow(() -> new BadRequestException("Task not found: " + dto.getTaskId()));

        Optional<RecurrenceRule> existing = recurrenceRuleRepository.findByTaskId(task.getId());
        if (existing.isPresent()) {
            throw new BadRequestException("Task already has a recurrence rule");
        }

        RecurrenceRule r = RecurrenceRule.builder()
                .recurrenceType(dto.getRecurrenceType())
                .interval(dto.getInterval())
                .endDate(dto.getEndDate())
                .createdAt(LocalDateTime.now().toString())
                .task(task)
                .build();

        RecurrenceRule saved = recurrenceRuleRepository.save(r);

        return new RecurrenceRuleResponseDTO(
                saved.getId(),
                saved.getRecurrenceType(),
                saved.getInterval(),
                saved.getEndDate(),
                saved.getTask() != null ? saved.getTask().getId() : null
        );
    }

    public RecurrenceRuleResponseDTO getById(Long id) {
        RecurrenceRule r = recurrenceRuleRepository.findById(id)
                .orElseThrow(() -> new RecurrenceRuleNotFoundException(id));
        return new RecurrenceRuleResponseDTO(r.getId(), r.getRecurrenceType(), r.getInterval(), r.getEndDate(), r.getTask() != null ? r.getTask().getId() : null);
    }

    @Transactional
    public void delete(Long id) {
        RecurrenceRule r = recurrenceRuleRepository.findById(id)
                .orElseThrow(() -> new RecurrenceRuleNotFoundException(id));
        recurrenceRuleRepository.delete(r);
    }
}

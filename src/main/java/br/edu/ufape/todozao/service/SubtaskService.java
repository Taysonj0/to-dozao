package br.edu.ufape.todozao.service;

import br.edu.ufape.todozao.model.QSubtask;
import br.edu.ufape.todozao.model.Subtask;
import br.edu.ufape.todozao.repository.SubtaskRepository;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SubtaskService {
    private final SubtaskRepository repository;

    public SubtaskService(SubtaskRepository repository){
        this.repository = repository;
    }

    public Subtask save(Subtask subtask) {
        if (subtask.getCreatedAt() == null) {
            subtask.setCreatedAt(LocalDateTime.now().toString());
        }
        return repository.save(subtask);
    }

    public Optional<Subtask> findById(Long id) {
        return repository.findById(id);
    }

    public List<Subtask> findByTaskId(Long taskId) {
        return repository.findByTaskId(taskId);
    }

    public List<Subtask> findByTaskIdAndCompleted(Long taskId, boolean completed) {
        return repository.findByTaskIdAndCompleted(taskId, completed);
    }

    public List<Subtask> findAll() {
        return repository.findAll();
    }

    public Subtask update(Long id, Subtask subtask) {
        Subtask existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subtarefa não encontrada"));
        
        existing.setTitle(subtask.getTitle());
        existing.setCompleted(subtask.isCompleted());
        
        return repository.save(existing);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public List<Subtask> findCompletedSubtasks() {
        QSubtask qSubtask = QSubtask.subtask;
        Predicate predicate = qSubtask.completed.eq(true);
        return (List<Subtask>) repository.findAll(predicate);
    }

    public List<Subtask> findByTitleContaining(String title) {
        QSubtask qSubtask = QSubtask.subtask;
        Predicate predicate = qSubtask.title.containsIgnoreCase(title);
        return (List<Subtask>) repository.findAll(predicate);
    }

    public List<Subtask> findByTaskIdAndTitleContaining(Long taskId, String title) {
        QSubtask qSubtask = QSubtask.subtask;
        BooleanBuilder builder = new BooleanBuilder();
        builder.and(qSubtask.task.id.eq(taskId));
        builder.and(qSubtask.title.containsIgnoreCase(title));
        return (List<Subtask>) repository.findAll(builder);
    }
}


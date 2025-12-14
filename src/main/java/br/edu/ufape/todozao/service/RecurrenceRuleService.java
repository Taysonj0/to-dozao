package br.edu.ufape.todozao.service;

import br.edu.ufape.todozao.model.RecurrenceRule;
import br.edu.ufape.todozao.model.QRecurrenceRule;
import br.edu.ufape.todozao.repository.RecurrenceRuleRepository;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class RecurrenceRuleService {
    private final RecurrenceRuleRepository repository;

    public RecurrenceRuleService(RecurrenceRuleRepository repository){
        this.repository = repository;
    }

    public RecurrenceRule save(RecurrenceRule recurrenceRule) {
        if (recurrenceRule.getCreatedAt() == null) {
            recurrenceRule.setCreatedAt(LocalDateTime.now().toString());
        }
        return repository.save(recurrenceRule);
    }

    public Optional<RecurrenceRule> findById(Long id) {
        return repository.findById(id);
    }

    public Optional<RecurrenceRule> findByTaskId(Long taskId) {
        return repository.findByTaskId(taskId);
    }

    public List<RecurrenceRule> findAll() {
        return repository.findAll();
    }

    public RecurrenceRule update(Long id, RecurrenceRule recurrenceRule) {
        RecurrenceRule existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Regra de recorrência não encontrada"));
        
        existing.setRecurrenceType(recurrenceRule.getRecurrenceType());
        existing.setInterval(recurrenceRule.getInterval());
        existing.setEndDate(recurrenceRule.getEndDate());
        
        return repository.save(existing);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }

    public List<RecurrenceRule> findByRecurrenceType(String recurrenceType) {
        QRecurrenceRule qRecurrenceRule = QRecurrenceRule.recurrenceRule;
        Predicate predicate = qRecurrenceRule.recurrenceType.eq(recurrenceType);
        return (List<RecurrenceRule>) repository.findAll(predicate);
    }

    public List<RecurrenceRule> findByIntervalGreaterThan(int interval) {
        QRecurrenceRule qRecurrenceRule = QRecurrenceRule.recurrenceRule;
        Predicate predicate = qRecurrenceRule.interval.gt(interval);
        return (List<RecurrenceRule>) repository.findAll(predicate);
    }

    public List<RecurrenceRule> findByRecurrenceTypeAndInterval(String recurrenceType, int interval) {
        QRecurrenceRule qRecurrenceRule = QRecurrenceRule.recurrenceRule;
        BooleanBuilder builder = new BooleanBuilder();
        builder.and(qRecurrenceRule.recurrenceType.eq(recurrenceType));
        builder.and(qRecurrenceRule.interval.eq(interval));
        return (List<RecurrenceRule>) repository.findAll(builder);
    }
}


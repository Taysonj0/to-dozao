package br.edu.ufape.todozao.repository;

import br.edu.ufape.todozao.model.RecurrenceRule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RecurrenceRuleRepository extends JpaRepository<RecurrenceRule, Long> {
    Optional<RecurrenceRule> findByTaskId(Long taskId);
}

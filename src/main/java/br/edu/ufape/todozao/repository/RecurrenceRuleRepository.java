package br.edu.ufape.todozao.repository;

import br.edu.ufape.todozao.model.RecurrenceRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

import java.util.Optional;

public interface RecurrenceRuleRepository extends JpaRepository<RecurrenceRule, Long>, QuerydslPredicateExecutor<RecurrenceRule> {//solicita um repositório para RecurrenceRule e o tipo da chave primária é Long
    
    Optional<RecurrenceRule> findByTaskId(Long taskId);



}

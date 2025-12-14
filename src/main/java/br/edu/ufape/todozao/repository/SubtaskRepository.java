package br.edu.ufape.todozao.repository;

import br.edu.ufape.todozao.model.Subtask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;

import java.util.List;

public interface SubtaskRepository extends JpaRepository<Subtask, Long>, QuerydslPredicateExecutor<Subtask> {//solicita um repositório para Subtask e o tipo da chave primária é Long
    
    List<Subtask> findByTaskId(Long taskId);
    
    List<Subtask> findByTaskIdAndCompleted(Long taskId, boolean completed);



}

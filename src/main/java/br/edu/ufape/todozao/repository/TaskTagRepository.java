package br.edu.ufape.todozao.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.edu.ufape.todozao.model.TaskTag;

public interface TaskTagRepository extends JpaRepository<TaskTag, Long> {

    boolean existsByTaskIdAndTagId(Long taskId, Long tagId);
}

package br.edu.ufape.todozao.repository;

import br.edu.ufape.todozao.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    boolean existsByNameAndUserId(String name, Long userId);

    List<Project> findByUserId(Long userId);

    @Query("SELECT p FROM Project p LEFT JOIN FETCH p.tasks WHERE p.user.id = :userId")
    List<Project> findByUserIdWithTasks(Long userId);
}

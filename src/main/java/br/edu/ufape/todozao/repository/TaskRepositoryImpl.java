package br.edu.ufape.todozao.repository;

import br.edu.ufape.todozao.model.Task;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class TaskRepositoryImpl implements TaskRepositoryCustom {

    private final EntityManager em;

    public TaskRepositoryImpl(EntityManager em) {
        this.em = em;
    }

    @Override
    public List<Task> buscarPorUsuarioEPrioridade(Long userId, String priority) {
        return em.createQuery("SELECT t FROM Task t WHERE t.user.id = :userId AND t.priority = :priority", Task.class)
                .setParameter("userId", userId)
                .setParameter("priority", priority)
                .getResultList();
    }
}

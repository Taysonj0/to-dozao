package br.edu.ufape.todozao.service;

import java.util.List;

import br.edu.ufape.todozao.exception.InvalidTaskDependencyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.edu.ufape.todozao.model.Task;
import br.edu.ufape.todozao.model.TaskDependency;
import br.edu.ufape.todozao.repository.TaskDependencyRepository;

@Service
public class TaskDependencyService {

    private final TaskDependencyRepository repository;

    public TaskDependencyService(TaskDependencyRepository repository) {
        this.repository = repository;
    }

    public List<TaskDependency> listarPorTask(Long taskId) {
        return repository.findByTaskId(taskId);
    }

    @Transactional
    public TaskDependency adicionarDependencia(Task task, Task dependsOn) {

        if (task.getId().equals(dependsOn.getId())) {
            throw new InvalidTaskDependencyException(
                    "Uma task não pode depender dela mesma"
            );
        }

        if (repository.existsByTaskIdAndDependsOnId(task.getId(), dependsOn.getId())) {
            throw new InvalidTaskDependencyException(
                    "Dependência já existe"
            );
        }

        // EVITA CICLO SIMPLES
        if (repository.existsByTaskIdAndDependsOnId(dependsOn.getId(), task.getId())) {
            throw new InvalidTaskDependencyException(
                    "Dependência circular detectada"
            );
        }

        return repository.save(
                TaskDependency.builder()
                        .task(task)
                        .dependsOn(dependsOn)
                        .build()
        );
    }


    @Transactional
    public void remover(Long id) {
        repository.deleteById(id);
    }
}

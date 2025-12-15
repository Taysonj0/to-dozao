package br.edu.ufape.todozao.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.edu.ufape.todozao.model.TaskTag;
import br.edu.ufape.todozao.repository.TaskTagRepository;

@Service
public class TaskTagService {

    private final TaskTagRepository repository;

    public TaskTagService(TaskTagRepository repository) {
        this.repository = repository;
    }

    public List<TaskTag> listarTodos() {
        return repository.findAll();
    }

    @Transactional
    public TaskTag salvar(TaskTag taskTag) {
        Long taskId = taskTag.getTask().getId();
        Long tagId = taskTag.getTag().getId();

        if (repository.existsByTaskIdAndTagId(taskId, tagId)) {
            throw new IllegalStateException("Tag já associada à task");
        }

        return repository.save(taskTag);
    }

    @Transactional
    public void remover(Long id) {
        repository.deleteById(id);
    }
}


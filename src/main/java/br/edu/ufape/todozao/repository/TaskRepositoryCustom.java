package br.edu.ufape.todozao.repository;

import br.edu.ufape.todozao.model.Task;
import java.util.List;

public interface TaskRepositoryCustom {

    List<Task> buscarPorUsuarioEPrioridade(Long userId, String priority);
}
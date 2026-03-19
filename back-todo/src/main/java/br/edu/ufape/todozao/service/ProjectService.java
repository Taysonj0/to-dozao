package br.edu.ufape.todozao.service;

import br.edu.ufape.todozao.dto.ProjectCreateDTO;
import br.edu.ufape.todozao.dto.ProjectWithTasksDTO;
import br.edu.ufape.todozao.model.Project;

import java.util.List;

public interface ProjectService {

    Project criarProjeto(ProjectCreateDTO dto);

    List<Project> listarProjetosDoUsuario(Long userId);

    List<ProjectWithTasksDTO> listarProjetosComTasks(Long userId); // ✅
}
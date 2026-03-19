package br.edu.ufape.todozao.service;

import br.edu.ufape.todozao.dto.ProjectCreateDTO;
import br.edu.ufape.todozao.dto.ProjectWithTasksDTO;
import br.edu.ufape.todozao.dto.TaskDTO;
import br.edu.ufape.todozao.exception.ProjectDuplicateException;
import br.edu.ufape.todozao.exception.UserNotFoundException;
import br.edu.ufape.todozao.model.Project;
import br.edu.ufape.todozao.model.User;
import br.edu.ufape.todozao.repository.ProjectRepository;
import br.edu.ufape.todozao.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public ProjectServiceImpl(ProjectRepository projectRepository,
                             UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Project criarProjeto(ProjectCreateDTO dto) {

        if (dto.getUserId() == null) {
            throw new IllegalArgumentException("Usuário é obrigatório");
        }

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new UserNotFoundException(dto.getUserId()));

        if (projectRepository.existsByNameAndUserId(dto.getName(), user.getId())) {
            throw new ProjectDuplicateException(
                    "Projeto já existe para esse usuário: " + dto.getName()
            );
        }

        Project project = Project.builder()
                .name(dto.getName())
                .color(dto.getColor())
                .user(user)
                .build();

        return projectRepository.save(project);
    }

    @Override
    public List<Project> listarProjetosDoUsuario(Long userId) {
        return projectRepository.findByUserId(userId);
    }

    @Override
    public List<ProjectWithTasksDTO> listarProjetosComTasks(Long userId) {
        List<Project> projects = projectRepository.findByUserIdWithTasks(userId);

        return projects.stream().map(project ->
                ProjectWithTasksDTO.builder()
                        .id(project.getId())
                        .name(project.getName())
                        .color(project.getColor())
                        .tasks(
                                project.getTasks().stream().map(task ->
                                        TaskDTO.builder()
                                                .id(task.getId())
                                                .title(task.getTitle())
                                                .description(task.getDescription())
                                                .color(task.getColor())
                                                .priority(task.getPriority())
                                                .taskStatus(task.getTaskStatus().name())
                                                .dueDate(task.getDueDate())
                                                .type(task.getType())
                                                .resetRule(task.getResetRule())
                                                .userId(task.getUser() != null ? task.getUser().getId() : null)
                                                .projectId(task.getProject() != null ? task.getProject().getId() : null)
                                                .build()
                                ).toList()
                        )
                        .build()
        ).toList();
    }
}

package br.edu.ufape.todozao.controller;

import br.edu.ufape.todozao.model.Task;
import br.edu.ufape.todozao.model.TaskStatus;
import br.edu.ufape.todozao.model.User;
import br.edu.ufape.todozao.model.UserRole;
import br.edu.ufape.todozao.repository.NotificationRepository;
import br.edu.ufape.todozao.repository.TaskRepository;
import br.edu.ufape.todozao.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

        @Autowired
        private NotificationRepository notificationRepository;

    private User authenticatedUser;
    private User otherUser;
    private Task authenticatedTask;
    private Task otherTask;

    @BeforeEach
    void setUp() {
                notificationRepository.deleteAll();
        taskRepository.deleteAll();
        userRepository.deleteAll();

        authenticatedUser = userRepository.save(User.builder()
                .name("Ana")
                .email("ana@email.com")
                .login("ana")
                .password(new BCryptPasswordEncoder().encode("12345678"))
                .role(UserRole.USER)
                .build());

        otherUser = userRepository.save(User.builder()
                .name("Bruno")
                .email("bruno@email.com")
                .login("bruno")
                .password(new BCryptPasswordEncoder().encode("12345678"))
                .role(UserRole.USER)
                .build());

        authenticatedTask = taskRepository.save(Task.builder()
                .title("Estudar POO")
                .description("Task da Ana")
                .taskStatus(TaskStatus.PENDING)
                .user(authenticatedUser)
                .build());

        otherTask = taskRepository.save(Task.builder()
                .title("Fazer compras")
                .description("Task do Bruno")
                .taskStatus(TaskStatus.IN_PROGRESS)
                .user(otherUser)
                .build());
    }

    @Test
    void deveListarApenasTasksDoUsuarioAutenticado() throws Exception {
        mockMvc.perform(get("/api/tasks")
                        .with(SecurityMockMvcRequestPostProcessors.user(authenticatedUser)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].id").value(authenticatedTask.getId()))
                .andExpect(jsonPath("$[0].title").value("Estudar POO"));
    }

    @Test
    void naoDevePermitirAcessarTaskDeOutroUsuario() throws Exception {
        mockMvc.perform(get("/api/tasks/{id}", otherTask.getId())
                        .with(SecurityMockMvcRequestPostProcessors.user(authenticatedUser)))
                .andExpect(status().isForbidden());
    }
}

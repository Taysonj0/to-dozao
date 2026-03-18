package br.edu.ufape.todozao.controller;

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
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.startsWith;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class UserControllerProfileIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    private User savedUser;

    @BeforeEach
    void setUp() {
        notificationRepository.deleteAll();
        taskRepository.deleteAll();
        userRepository.deleteAll();

        savedUser = userRepository.save(User.builder()
                .name("João Moura")
                .email("joao@todozao.app")
                .login("joao")
                .password(new BCryptPasswordEncoder().encode("12345678"))
                .role(UserRole.USER)
                .headline("Responsável pelo perfil")
                .bio("Bio inicial")
                .location("Garanhuns, PE")
                .avatarUrl("/uploads/avatars/joao.png")
                .build());
    }

    @Test
    void deveBuscarPerfilDoUsuarioAutenticado() throws Exception {
        mockMvc.perform(get("/users/me/profile")
                        .with(SecurityMockMvcRequestPostProcessors.user(savedUser)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(savedUser.getId()))
                .andExpect(jsonPath("$.name").value("João Moura"))
                .andExpect(jsonPath("$.headline").value("Responsável pelo perfil"))
                .andExpect(jsonPath("$.avatarUrl").value("/uploads/avatars/joao.png"));
    }

    @Test
    void deveAtualizarPerfilDoUsuarioAutenticado() throws Exception {
        String body = """
                {
                                    "name": "João Atualizado",
                                    "email": "joao.atualizado@todozao.app",
                                    "headline": "Nova headline",
                                    "bio": "Nova bio",
                                    "location": "Recife, PE"
                }
                """;

        mockMvc.perform(put("/users/me/profile")
                        .with(SecurityMockMvcRequestPostProcessors.user(savedUser))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("João Atualizado"))
                .andExpect(jsonPath("$.email").value("joao.atualizado@todozao.app"))
                .andExpect(jsonPath("$.headline").value("Nova headline"))
                .andExpect(jsonPath("$.location").value("Recife, PE"))
                .andExpect(jsonPath("$.avatarUrl").value("/uploads/avatars/joao.png"));
    }

    @Test
    void deveEnviarAvatarDoUsuarioAutenticado() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "avatar.png", "image/png", new byte[]{1, 2, 3, 4});

        mockMvc.perform(multipart("/users/me/avatar")
                        .file(file)
                        .with(request -> {
                            request.setMethod("POST");
                            return request;
                        })
                        .with(SecurityMockMvcRequestPostProcessors.user(savedUser)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.avatarUrl", startsWith("/uploads/avatars/user-")));
    }

    @Test
    void deveRemoverAvatarDoUsuarioAutenticado() throws Exception {
        mockMvc.perform(delete("/users/me/avatar")
                        .with(SecurityMockMvcRequestPostProcessors.user(savedUser)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.avatarUrl").isEmpty());
    }
}

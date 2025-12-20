package br.edu.ufape.todozao.controller;

import br.edu.ufape.todozao.dto.NotificationCreateDTO;
import br.edu.ufape.todozao.model.Task;
import br.edu.ufape.todozao.model.User;
import br.edu.ufape.todozao.repository.TaskRepository;
import br.edu.ufape.todozao.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class NotificationControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Test
    void deveCriarNotification() throws Exception {
        User user = User.builder().name("U").email("u@u.com").password("p").build();
        user = userRepository.save(user);

        Task task = Task.builder().title("T").user(user).build();
        task = taskRepository.save(task);

        NotificationCreateDTO dto = new NotificationCreateDTO();
        dto.setTitle("Not 1");
        dto.setMessage("Msg");
        dto.setTaskId(task.getId());

        mockMvc.perform(post("/api/notifications")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Not 1"))
                .andExpect(jsonPath("$.message").value("Msg"))
                .andExpect(jsonPath("$.taskId").value(task.getId()));
    }
}

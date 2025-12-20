package br.edu.ufape.todozao.controller;

import br.edu.ufape.todozao.dto.RecurrenceRuleCreateDTO;
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
class RecurrenceRuleControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Test
    void deveCriarRecurrenceRule() throws Exception {
        User user = User.builder().name("U").email("u@u.com").password("p").build();
        user = userRepository.save(user);

        Task task = Task.builder().title("T").user(user).build();
        task = taskRepository.save(task);

        RecurrenceRuleCreateDTO dto = new RecurrenceRuleCreateDTO();
        dto.setRecurrenceType("diariamente");
        dto.setInterval(1);
        dto.setEndDate("2025-12-31");
        dto.setTaskId(task.getId());

        mockMvc.perform(post("/api/recurrence-rules")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.recurrenceType").value("diariamente"))
                .andExpect(jsonPath("$.interval").value(1))
                .andExpect(jsonPath("$.taskId").value(task.getId()));
    }
}

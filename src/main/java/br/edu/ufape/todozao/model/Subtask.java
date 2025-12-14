package br.edu.ufape.todozao.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "subtasks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Subtask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O título da subtarefa é obrigatório")
    private String title;

    @Column(name = "is_completed")
    private boolean completed;

    @Column(name = "created_at")
    private String createdAt;

    @NotNull(message = "A tarefa é obrigatória")
    @ManyToOne
    @JoinColumn(name = "task_id")
    private Task task;
}

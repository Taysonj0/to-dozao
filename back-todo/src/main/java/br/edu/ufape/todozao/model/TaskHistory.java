package br.edu.ufape.todozao.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "task_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private TaskStatus status;

    private String notes;

    @Column(name = "changed_at")
    private String changedAt;

    @ManyToOne
    @JoinColumn(name = "task_id")
    private Task task;
}

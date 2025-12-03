package br.edu.ufape.todozao.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "minutes_spent")
    private int minutesSpent;

    @Column(name = "created_at")
    private String createdAt;

    // RELACIONAMENTO COM TASK

    @ManyToOne
    @JoinColumn(name = "task_id")
    private Task task;
}

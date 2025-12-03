package br.edu.ufape.todozao.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String title;

    private String description;
    private String color;
    private String priority;

    @Column(name = "due_date")
    private String dueDate;

    private String type;

    @Column(name = "reset_rule")
    private String resetRule;

    @Column(name = "created_at")
    private String createdAt;

    @Column(name = "updated_at")
    private String updatedAt;

    // RELACIONAMENTOS

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL)
    private List<Subtask> subtasks;

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL)
    private List<WorkItem> workItems;

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL)
    private List<TaskTag> taskTags;

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL)
    private List<TaskDependency> dependencies;

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL)
    private List<TaskHistory> history;

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL)
    private List<HabitHistory> habitHistory;

    @OneToOne(mappedBy = "task", cascade = CascadeType.ALL)
    private RecurrenceRule recurrenceRule;

}

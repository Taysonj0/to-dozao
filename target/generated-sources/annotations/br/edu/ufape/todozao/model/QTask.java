package br.edu.ufape.todozao.model;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QTask is a Querydsl query type for Task
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QTask extends EntityPathBase<Task> {

    private static final long serialVersionUID = -48998059L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QTask task = new QTask("task");

    public final StringPath color = createString("color");

    public final StringPath createdAt = createString("createdAt");

    public final ListPath<TaskDependency, QTaskDependency> dependencies = this.<TaskDependency, QTaskDependency>createList("dependencies", TaskDependency.class, QTaskDependency.class, PathInits.DIRECT2);

    public final StringPath description = createString("description");

    public final StringPath dueDate = createString("dueDate");

    public final ListPath<HabitHistory, QHabitHistory> habitHistory = this.<HabitHistory, QHabitHistory>createList("habitHistory", HabitHistory.class, QHabitHistory.class, PathInits.DIRECT2);

    public final ListPath<TaskHistory, QTaskHistory> history = this.<TaskHistory, QTaskHistory>createList("history", TaskHistory.class, QTaskHistory.class, PathInits.DIRECT2);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final StringPath priority = createString("priority");

    public final QProject project;

    public final QRecurrenceRule recurrenceRule;

    public final StringPath resetRule = createString("resetRule");

    public final ListPath<Subtask, QSubtask> subtasks = this.<Subtask, QSubtask>createList("subtasks", Subtask.class, QSubtask.class, PathInits.DIRECT2);

    public final EnumPath<TaskStatus> taskStatus = createEnum("taskStatus", TaskStatus.class);

    public final ListPath<TaskTag, QTaskTag> taskTags = this.<TaskTag, QTaskTag>createList("taskTags", TaskTag.class, QTaskTag.class, PathInits.DIRECT2);

    public final StringPath title = createString("title");

    public final StringPath type = createString("type");

    public final StringPath updatedAt = createString("updatedAt");

    public final QUser user;

    public final ListPath<WorkItem, QWorkItem> workItems = this.<WorkItem, QWorkItem>createList("workItems", WorkItem.class, QWorkItem.class, PathInits.DIRECT2);

    public QTask(String variable) {
        this(Task.class, forVariable(variable), INITS);
    }

    public QTask(Path<? extends Task> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QTask(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QTask(PathMetadata metadata, PathInits inits) {
        this(Task.class, metadata, inits);
    }

    public QTask(Class<? extends Task> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.project = inits.isInitialized("project") ? new QProject(forProperty("project"), inits.get("project")) : null;
        this.recurrenceRule = inits.isInitialized("recurrenceRule") ? new QRecurrenceRule(forProperty("recurrenceRule"), inits.get("recurrenceRule")) : null;
        this.user = inits.isInitialized("user") ? new QUser(forProperty("user")) : null;
    }

}


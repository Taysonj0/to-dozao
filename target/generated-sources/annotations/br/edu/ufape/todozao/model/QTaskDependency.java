package br.edu.ufape.todozao.model;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QTaskDependency is a Querydsl query type for TaskDependency
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QTaskDependency extends EntityPathBase<TaskDependency> {

    private static final long serialVersionUID = 459874944L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QTaskDependency taskDependency = new QTaskDependency("taskDependency");

    public final StringPath createdAt = createString("createdAt");

    public final QTask dependsOn;

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final QTask task;

    public QTaskDependency(String variable) {
        this(TaskDependency.class, forVariable(variable), INITS);
    }

    public QTaskDependency(Path<? extends TaskDependency> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QTaskDependency(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QTaskDependency(PathMetadata metadata, PathInits inits) {
        this(TaskDependency.class, metadata, inits);
    }

    public QTaskDependency(Class<? extends TaskDependency> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.dependsOn = inits.isInitialized("dependsOn") ? new QTask(forProperty("dependsOn"), inits.get("dependsOn")) : null;
        this.task = inits.isInitialized("task") ? new QTask(forProperty("task"), inits.get("task")) : null;
    }

}


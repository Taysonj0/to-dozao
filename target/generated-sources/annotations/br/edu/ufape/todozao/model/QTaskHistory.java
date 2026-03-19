package br.edu.ufape.todozao.model;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QTaskHistory is a Querydsl query type for TaskHistory
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QTaskHistory extends EntityPathBase<TaskHistory> {

    private static final long serialVersionUID = 1161947519L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QTaskHistory taskHistory = new QTaskHistory("taskHistory");

    public final StringPath changedAt = createString("changedAt");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final StringPath notes = createString("notes");

    public final EnumPath<TaskStatus> status = createEnum("status", TaskStatus.class);

    public final QTask task;

    public QTaskHistory(String variable) {
        this(TaskHistory.class, forVariable(variable), INITS);
    }

    public QTaskHistory(Path<? extends TaskHistory> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QTaskHistory(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QTaskHistory(PathMetadata metadata, PathInits inits) {
        this(TaskHistory.class, metadata, inits);
    }

    public QTaskHistory(Class<? extends TaskHistory> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.task = inits.isInitialized("task") ? new QTask(forProperty("task"), inits.get("task")) : null;
    }

}


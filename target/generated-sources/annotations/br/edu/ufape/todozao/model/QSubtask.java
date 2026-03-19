package br.edu.ufape.todozao.model;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QSubtask is a Querydsl query type for Subtask
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QSubtask extends EntityPathBase<Subtask> {

    private static final long serialVersionUID = 257449461L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QSubtask subtask = new QSubtask("subtask");

    public final BooleanPath completed = createBoolean("completed");

    public final StringPath createdAt = createString("createdAt");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final QTask task;

    public final StringPath title = createString("title");

    public QSubtask(String variable) {
        this(Subtask.class, forVariable(variable), INITS);
    }

    public QSubtask(Path<? extends Subtask> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QSubtask(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QSubtask(PathMetadata metadata, PathInits inits) {
        this(Subtask.class, metadata, inits);
    }

    public QSubtask(Class<? extends Subtask> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.task = inits.isInitialized("task") ? new QTask(forProperty("task"), inits.get("task")) : null;
    }

}


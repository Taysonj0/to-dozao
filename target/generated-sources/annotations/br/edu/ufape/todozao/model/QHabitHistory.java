package br.edu.ufape.todozao.model;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QHabitHistory is a Querydsl query type for HabitHistory
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QHabitHistory extends EntityPathBase<HabitHistory> {

    private static final long serialVersionUID = -1658330032L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QHabitHistory habitHistory = new QHabitHistory("habitHistory");

    public final BooleanPath completed = createBoolean("completed");

    public final StringPath createdAt = createString("createdAt");

    public final StringPath date = createString("date");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final QTask task;

    public QHabitHistory(String variable) {
        this(HabitHistory.class, forVariable(variable), INITS);
    }

    public QHabitHistory(Path<? extends HabitHistory> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QHabitHistory(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QHabitHistory(PathMetadata metadata, PathInits inits) {
        this(HabitHistory.class, metadata, inits);
    }

    public QHabitHistory(Class<? extends HabitHistory> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.task = inits.isInitialized("task") ? new QTask(forProperty("task"), inits.get("task")) : null;
    }

}


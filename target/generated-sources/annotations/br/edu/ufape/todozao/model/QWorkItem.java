package br.edu.ufape.todozao.model;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QWorkItem is a Querydsl query type for WorkItem
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QWorkItem extends EntityPathBase<WorkItem> {

    private static final long serialVersionUID = 1486258580L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QWorkItem workItem = new QWorkItem("workItem");

    public final StringPath createdAt = createString("createdAt");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final NumberPath<Integer> minutesSpent = createNumber("minutesSpent", Integer.class);

    public final QTask task;

    public QWorkItem(String variable) {
        this(WorkItem.class, forVariable(variable), INITS);
    }

    public QWorkItem(Path<? extends WorkItem> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QWorkItem(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QWorkItem(PathMetadata metadata, PathInits inits) {
        this(WorkItem.class, metadata, inits);
    }

    public QWorkItem(Class<? extends WorkItem> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.task = inits.isInitialized("task") ? new QTask(forProperty("task"), inits.get("task")) : null;
    }

}


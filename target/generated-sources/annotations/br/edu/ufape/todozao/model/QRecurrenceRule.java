package br.edu.ufape.todozao.model;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QRecurrenceRule is a Querydsl query type for RecurrenceRule
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QRecurrenceRule extends EntityPathBase<RecurrenceRule> {

    private static final long serialVersionUID = 652586524L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QRecurrenceRule recurrenceRule = new QRecurrenceRule("recurrenceRule");

    public final StringPath createdAt = createString("createdAt");

    public final StringPath endDate = createString("endDate");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final NumberPath<Integer> interval = createNumber("interval", Integer.class);

    public final StringPath recurrenceType = createString("recurrenceType");

    public final QTask task;

    public QRecurrenceRule(String variable) {
        this(RecurrenceRule.class, forVariable(variable), INITS);
    }

    public QRecurrenceRule(Path<? extends RecurrenceRule> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QRecurrenceRule(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QRecurrenceRule(PathMetadata metadata, PathInits inits) {
        this(RecurrenceRule.class, metadata, inits);
    }

    public QRecurrenceRule(Class<? extends RecurrenceRule> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.task = inits.isInitialized("task") ? new QTask(forProperty("task"), inits.get("task")) : null;
    }

}


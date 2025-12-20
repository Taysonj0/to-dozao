package br.edu.ufape.todozao.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RecurrenceRuleCreateDTO {
    private String recurrenceType;

    @NotNull
    @Min(1)
    private Integer interval;

    private String endDate;

    @NotNull
    private Long taskId;
}

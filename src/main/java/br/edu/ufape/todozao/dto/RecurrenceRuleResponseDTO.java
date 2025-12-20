package br.edu.ufape.todozao.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RecurrenceRuleResponseDTO {
    private Long id;
    private String recurrenceType;
    private Integer interval;
    private String endDate;
    private Long taskId;
}

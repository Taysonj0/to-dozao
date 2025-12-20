package br.edu.ufape.todozao.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class NotificationResponseDTO {
    private Long id;
    private String title;
    private String message;
    private boolean read;
    private LocalDateTime createdAt;
    private Long taskId;
}

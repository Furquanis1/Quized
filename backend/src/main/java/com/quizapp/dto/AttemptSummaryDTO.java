package com.quizapp.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttemptSummaryDTO {
    private Long attemptId;
    private Long quizId;
    private String quizTitle;
    private Integer score;
    private Integer totalPoints;
    private double percentage;
    private LocalDateTime completedAt;
}

package com.quizapp.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizResultDTO {
    private Long attemptId;
    private String quizTitle;
    private Integer score;
    private Integer totalPoints;
    private double percentage;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private List<QuestionResultDTO> details;
}

package com.quizapp.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizDTO {
    private Long id;
    private String title;
    private String description;
    private Integer timeLimit;
    private boolean active;
    private Integer questionCount;
}

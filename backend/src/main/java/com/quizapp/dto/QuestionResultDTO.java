package com.quizapp.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionResultDTO {
    private Long questionId;
    private String questionText;
    private Long selectedOptionId;
    private String selectedOptionText;
    private Long correctOptionId;
    private String correctOptionText;
    private boolean correct;
    private Integer points;
}

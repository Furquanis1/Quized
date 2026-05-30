package com.quizapp.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnswerDTO {
    private Long questionId;
    private Long selectedOptionId;
}

package com.quizapp.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizDetailDTO {
    private Long id;
    private String title;
    private String description;
    private Integer timeLimit;
    private List<QuestionDetailDTO> questions;
}

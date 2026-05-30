package com.quizapp.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizSubmissionDTO {
    private List<AnswerDTO> answers;
}

package com.quizapp.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminQuestionDTO {
    private Long id;
    private String questionText;
    private Integer points;
    private List<AdminOptionDTO> options;
}

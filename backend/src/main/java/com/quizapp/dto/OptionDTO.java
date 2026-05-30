package com.quizapp.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OptionDTO {
    private Long id;
    private String optionText;
    private Boolean correct;
}

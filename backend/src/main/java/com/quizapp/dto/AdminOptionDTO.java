package com.quizapp.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminOptionDTO {
    private Long id;
    private String optionText;
    private boolean correct;
}

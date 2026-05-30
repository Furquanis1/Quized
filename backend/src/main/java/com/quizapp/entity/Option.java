package com.quizapp.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "options")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Option {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id")
    @JsonIgnore
    private Question question;

    @NotBlank(message = "Option text is required")
    private String optionText;

    private boolean correct;

    public boolean isCorrect() {
        return correct;
    }
}

package com.quizapp.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "attempt_answers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttemptAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "attempt_id")
    @JsonIgnore
    private QuizAttempt attempt;

    private Long questionId;
    private Long selectedOptionId;
}

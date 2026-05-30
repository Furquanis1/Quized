package com.quizapp.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "quiz_attempts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id")
    private Quiz quiz;

    private Integer score;
    private Integer totalPoints;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;

    @OneToMany(mappedBy = "attempt", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<AttemptAnswer> answers = new ArrayList<>();
}

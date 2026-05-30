package com.quizapp.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id")
    @JsonIgnoreProperties({"questions", "hibernateLazyInitializer", "handler"})
    private Quiz quiz;

    @NotBlank(message = "Question text is required")
    @Column(columnDefinition = "TEXT")
    private String questionText;

    @Builder.Default
    private Integer points = 1;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Builder.Default
    private List<Option> options = new ArrayList<>();
}

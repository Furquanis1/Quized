package com.quizapp.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "quizzes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @Min(value = 1, message = "Time limit must be at least 1 minute")
    private Integer timeLimit;

    @Builder.Default
    private boolean active = true;

    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @Builder.Default
    private List<Question> questions = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}

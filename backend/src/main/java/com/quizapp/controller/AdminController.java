package com.quizapp.controller;

import com.quizapp.dto.*;
import com.quizapp.entity.Quiz;
import com.quizapp.entity.Question;
import com.quizapp.service.AttemptService;
import com.quizapp.service.QuestionService;
import com.quizapp.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final QuizService quizService;
    private final QuestionService questionService;
    private final AttemptService attemptService;

    @GetMapping("/quizzes")
    public ResponseEntity<List<QuizDTO>> getAllQuizzes() {
        return ResponseEntity.ok(quizService.getAllQuizzesAdmin());
    }

    @PostMapping("/quizzes")
    public ResponseEntity<Quiz> createQuiz(@RequestBody Quiz quiz) {
        return ResponseEntity.ok(quizService.createQuiz(quiz));
    }

    @GetMapping("/quizzes/{id}")
    public ResponseEntity<Quiz> getQuizById(@PathVariable Long id) {
        return ResponseEntity.ok(quizService.getQuizForAdmin(id));
    }

    @PutMapping("/quizzes/{id}")
    public ResponseEntity<Quiz> updateQuiz(@PathVariable Long id, @RequestBody Quiz quiz) {
        return ResponseEntity.ok(quizService.updateQuiz(id, quiz));
    }

    @DeleteMapping("/quizzes/{id}")
    public ResponseEntity<Void> deleteQuiz(@PathVariable Long id) {
        quizService.deleteQuiz(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/quizzes/{quizId}/questions")
    public ResponseEntity<List<AdminQuestionDTO>> getQuestionsByQuizId(@PathVariable Long quizId) {
        return ResponseEntity.ok(questionService.getQuestionsByQuizId(quizId));
    }

    @PostMapping("/quizzes/{quizId}/questions")
    public ResponseEntity<Question> addQuestion(@PathVariable Long quizId, @RequestBody Question question) {
        return ResponseEntity.ok(questionService.addQuestion(quizId, question));
    }

    @PutMapping("/questions/{id}")
    public ResponseEntity<Question> updateQuestion(@PathVariable Long id, @RequestBody Question question) {
        return ResponseEntity.ok(questionService.updateQuestion(id, question));
    }

    @DeleteMapping("/questions/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/attempts")
    public ResponseEntity<List<AttemptSummaryDTO>> getAllAttempts() {
        return ResponseEntity.ok(attemptService.getAllAttempts());
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<LeaderboardDTO>> getLeaderboard() {
        return ResponseEntity.ok(attemptService.getLeaderboard());
    }
}

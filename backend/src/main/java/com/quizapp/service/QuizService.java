package com.quizapp.service;

import com.quizapp.dto.*;
import com.quizapp.entity.Quiz;
import com.quizapp.exception.ResourceNotFoundException;
import com.quizapp.repository.QuizRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuizRepository quizRepository;

    @Transactional(readOnly = true)
    public List<QuizDTO> getAllActiveQuizzes() {
        return quizRepository.findByActiveTrue().stream()
                .map(quiz -> QuizDTO.builder()
                        .id(quiz.getId())
                        .title(quiz.getTitle())
                        .description(quiz.getDescription())
                        .timeLimit(quiz.getTimeLimit())
                        .active(quiz.isActive())
                        .questionCount(quiz.getQuestions().size())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public QuizDetailDTO getQuizById(Long id) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with id: " + id));

        List<QuestionDetailDTO> questions = quiz.getQuestions().stream()
                .map(q -> QuestionDetailDTO.builder()
                        .id(q.getId())
                        .questionText(q.getQuestionText())
                        .points(q.getPoints())
                        .options(q.getOptions().stream()
                                .map(o -> OptionDTO.builder()
                                        .id(o.getId())
                                        .optionText(o.getOptionText())
                                        .correct(o.isCorrect())
                                        .build())
                                .collect(Collectors.toList()))
                        .build())
                .collect(Collectors.toList());

        return QuizDetailDTO.builder()
                .id(quiz.getId())
                .title(quiz.getTitle())
                .description(quiz.getDescription())
                .timeLimit(quiz.getTimeLimit())
                .questions(questions)
                .build();
    }

    @Transactional(readOnly = true)
    public Quiz getQuizForAdmin(Long id) {
        return quizRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with id: " + id));
    }

    public Quiz createQuiz(Quiz quiz) {
        return quizRepository.save(quiz);
    }

    public Quiz updateQuiz(Long id, Quiz quizDetails) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with id: " + id));
        quiz.setTitle(quizDetails.getTitle());
        quiz.setDescription(quizDetails.getDescription());
        quiz.setTimeLimit(quizDetails.getTimeLimit());
        quiz.setActive(quizDetails.isActive());
        return quizRepository.save(quiz);
    }

    public void deleteQuiz(Long id) {
        if (!quizRepository.existsById(id)) {
            throw new ResourceNotFoundException("Quiz not found with id: " + id);
        }
        quizRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<QuizDTO> getAllQuizzesAdmin() {
        return quizRepository.findAll().stream()
                .map(quiz -> QuizDTO.builder()
                        .id(quiz.getId())
                        .title(quiz.getTitle())
                        .description(quiz.getDescription())
                        .timeLimit(quiz.getTimeLimit())
                        .active(quiz.isActive())
                        .questionCount(quiz.getQuestions().size())
                        .build())
                .collect(Collectors.toList());
    }
}

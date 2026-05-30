package com.quizapp.service;

import com.quizapp.dto.AdminOptionDTO;
import com.quizapp.dto.AdminQuestionDTO;
import com.quizapp.entity.Option;
import com.quizapp.entity.Question;
import com.quizapp.entity.Quiz;
import com.quizapp.exception.ResourceNotFoundException;
import com.quizapp.repository.QuestionRepository;
import com.quizapp.repository.QuizRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final QuizRepository quizRepository;

    public List<AdminQuestionDTO> getQuestionsByQuizId(Long quizId) {
        return questionRepository.findByQuizId(quizId).stream()
                .map(q -> AdminQuestionDTO.builder()
                        .id(q.getId())
                        .questionText(q.getQuestionText())
                        .points(q.getPoints())
                        .options(q.getOptions().stream()
                                .map(o -> AdminOptionDTO.builder()
                                        .id(o.getId())
                                        .optionText(o.getOptionText())
                                        .correct(o.isCorrect())
                                        .build())
                                .collect(Collectors.toList()))
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public Question addQuestion(Long quizId, Question question) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with id: " + quizId));
        question.setQuiz(quiz);
        if (question.getOptions() != null) {
            question.getOptions().forEach(option -> option.setQuestion(question));
        }
        return questionRepository.save(question);
    }

    @Transactional
    public Question updateQuestion(Long questionId, Question questionDetails) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found with id: " + questionId));

        question.setQuestionText(questionDetails.getQuestionText());
        question.setPoints(questionDetails.getPoints());

        question.getOptions().clear();
        if (questionDetails.getOptions() != null) {
            for (Option option : questionDetails.getOptions()) {
                option.setQuestion(question);
                question.getOptions().add(option);
            }
        }

        return questionRepository.save(question);
    }

    public void deleteQuestion(Long questionId) {
        if (!questionRepository.existsById(questionId)) {
            throw new ResourceNotFoundException("Question not found with id: " + questionId);
        }
        questionRepository.deleteById(questionId);
    }
}

"use strict";
const questions = [
  {
    text: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correct: "Mars",
    cardId: "q1",
    inputName: "answer1",
    submitId: "submit-q1",
    feedbackId: "feedback-q1",
  },
  {
    text: "Which planet is closest to the Sun?",
    options: ["Mercury", "Venus", "Earth", "Mars"],
    correct: "Mercury",
    cardId: "q2",
    inputName: "answer2",
    submitId: "submit-q2",
    feedbackId: "feedback-q2",
  },
];
const states = questions.map(() => ({ selected: "", submitted: false }));
function selectOption(value, questionIndex) {
  const question = questions[questionIndex];
  states[questionIndex].selected = value;
  const allLabels = document.querySelectorAll(
    `#${question.cardId} .option-label`,
  );
  allLabels.forEach(function (label) {
    label.classList.remove("selected");
  });
  const chosenInput = document.querySelector(
    `#${question.cardId} input[name="${question.inputName}"][value="${value}"]`,
  );
  if (chosenInput) {
    chosenInput.parentElement?.classList.add("selected");
  }
}
function showFeedback(questionIndex, type, message) {
  const feedback = document.getElementById(questions[questionIndex].feedbackId);
  feedback.className = "feedback " + type;
  feedback.innerHTML = message;
}
function highlightAnswers(questionIndex) {
  const question = questions[questionIndex];
  const state = states[questionIndex];
  const allLabels = document.querySelectorAll(
    `#${question.cardId} .option-label`,
  );
  allLabels.forEach(function (label) {
    label.classList.remove("selected", "correct-highlight", "wrong-highlight");
  });
  document
    .getElementById(`lbl-${question.correct}-${question.cardId}`)
    ?.classList.add("correct-highlight");
  if (state.selected !== question.correct) {
    document
      .getElementById(`lbl-${state.selected}-${question.cardId}`)
      ?.classList.add("wrong-highlight");
  }
}
function handleSubmit(questionIndex) {
  const question = questions[questionIndex];
  const state = states[questionIndex];
  const submitButton = document.getElementById(question.submitId);
  if (state.submitted) return;
  if (state.selected === "") {
    showFeedback(
      questionIndex,
      "warn",
      "⚠️ Please select an answer before submitting.",
    );
    return;
  }
  state.submitted = true;
  submitButton.disabled = true;
  highlightAnswers(questionIndex);
  if (state.selected === question.correct) {
    showFeedback(
      questionIndex,
      "correct",
      `✓ <strong>Correct!</strong> ${question.correct} is the right answer.`,
    );
  } else {
    showFeedback(
      questionIndex,
      "incorrect",
      `✗ <strong>Not quite.</strong> The correct answer is <strong>${question.correct}</strong>.`,
    );
  }
}
questions.forEach(function (question, index) {
  const inputs = document.querySelectorAll(
    `#${question.cardId} input[name="${question.inputName}"]`,
  );
  inputs.forEach(function (input) {
    input.addEventListener("change", function () {
      selectOption(input.value, index);
    });
  });
  const submitButton = document.getElementById(question.submitId);
  submitButton?.addEventListener("click", function () {
    handleSubmit(index);
  });
});

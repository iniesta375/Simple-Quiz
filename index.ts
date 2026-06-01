interface Question {
  text: string;
  options: string[];
  correct: string;
  cardId: string;
  inputName: string;
  submitId: string;
  feedbackId: string;
}

interface QuizState {
  selected: string;
  submitted: boolean;
}

const questions: Question[] = [
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

const states: QuizState[] = questions.map(() => ({ selected: "", submitted: false }));

function selectOption(value: string, questionIndex: number) {
  const question = questions[questionIndex];
  states[questionIndex].selected = value;

  const allLabels = document.querySelectorAll<HTMLLabelElement>(`#${question.cardId} .option-label`);
  allLabels.forEach(function (label) {
    label.classList.remove("selected");
  });

  const chosenInput = document.querySelector<HTMLInputElement>(
    `#${question.cardId} input[name="${question.inputName}"][value="${value}"]`
  );
  if (chosenInput) {
    chosenInput.parentElement?.classList.add("selected");
  }
}

function showFeedback(questionIndex: number, type: "correct" | "incorrect" | "warn", message: string) {
  const feedback = document.getElementById(questions[questionIndex].feedbackId) as HTMLParagraphElement;
  feedback.className = "feedback " + type;
  feedback.innerHTML = message;
}

function highlightAnswers(questionIndex: number) {
  const question = questions[questionIndex];
  const state = states[questionIndex];
  const allLabels = document.querySelectorAll<HTMLLabelElement>(`#${question.cardId} .option-label`);
  allLabels.forEach(function (label) {
    label.classList.remove("selected", "correct-highlight", "wrong-highlight");
  });

  document.getElementById(`lbl-${question.correct}-${question.cardId}`)?.classList.add("correct-highlight");

  if (state.selected !== question.correct) {
    document.getElementById(`lbl-${state.selected}-${question.cardId}`)?.classList.add("wrong-highlight");
  }
}

function handleSubmit(questionIndex: number) {
  const question = questions[questionIndex];
  const state = states[questionIndex];
  const submitButton = document.getElementById(question.submitId) as HTMLButtonElement;

  if (state.submitted) return;

  if (state.selected === "") {
    showFeedback(questionIndex, "warn", "Please select an answer before submitting.");
    return;
  }

  state.submitted = true;
  submitButton.disabled = true;
  highlightAnswers(questionIndex);

  if (state.selected === question.correct) {
    showFeedback(
      questionIndex,
      "correct",
      `✓ <strong>Correct!</strong> ${question.correct} is the right answer.`
    );
  } else {
    showFeedback(
      questionIndex,
      "incorrect",
      `✗ <strong>Not quite.</strong> The correct answer is <strong>${question.correct}</strong>.`
    );
  }
}

questions.forEach(function (question, index) {
  const inputs = document.querySelectorAll<HTMLInputElement>(`#${question.cardId} input[name="${question.inputName}"]`);
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
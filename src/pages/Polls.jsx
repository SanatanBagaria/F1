import React, { useState } from "react";

const Polls = () => {
  const [activeTab, setActiveTab] = useState("polls");
  const [userVotes, setUserVotes] = useState({});
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [quizScore, setQuizScore] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);

  const initialPolls = [
    {
      id: 1,
      question: "Who will win the 2026 Drivers' Championship?",
      options: [
        { text: "Max Verstappen", votes: 1247 },
        { text: "Lando Norris", votes: 892 },
        { text: "Charles Leclerc", votes: 634 },
        { text: "Lewis Hamilton", votes: 712 },
      ],
    },
    {
      id: 2,
      question: "Which team will win the 2026 Constructors' Championship?",
      options: [
        { text: "McLaren", votes: 1156 },
        { text: "Ferrari", votes: 1210 },
        { text: "Red Bull Racing", votes: 987 },
        { text: "Mercedes", votes: 412 },
      ],
    },
    {
      id: 3,
      question: "Who will surprise the most in the upcoming season?",
      options: [
        { text: "Kimi Antonelli", votes: 654 },
        { text: "Liam Lawson", votes: 323 },
        { text: "Oliver Bearman", votes: 456 },
        { text: "Jack Doohan", votes: 112 },
      ],
    },
  ];

  const [polls, setPolls] = useState(initialPolls);

  const quizzes = [
    {
      id: 1,
      title: "F1 2025 Season Quiz",
      description: "Test your knowledge of the historic 2025 Formula 1 season!",
      questions: [
        {
          q: "Who won the 2025 F1 Drivers' Championship?",
          options: ["Max Verstappen", "Lando Norris", "Charles Leclerc", "Lewis Hamilton"],
          answer: 1 // Lando Norris
        },
        {
          q: "Which team won the 2025 Constructors' Championship?",
          options: ["McLaren", "Ferrari", "Red Bull Racing", "Mercedes"],
          answer: 0 // McLaren
        },
        {
          q: "Where was Lewis Hamilton driving in the 2025 season?",
          options: ["Mercedes", "Ferrari", "Red Bull", "Aston Martin"],
          answer: 0 // Mercedes (he moves to Ferrari in 2026)
        },
        {
          q: "How many wins did Lando Norris score in 2025?",
          options: ["5 wins", "7 wins", "9 wins", "11 wins"],
          answer: 1 // 7 wins
        },
        {
          q: "Which street race hosted the final round of Hamilton's Mercedes career?",
          options: ["Abu Dhabi", "Las Vegas", "Jeddah", "Singapore"],
          answer: 0 // Abu Dhabi
        }
      ]
    },
    {
      id: 2,
      title: "F1 Legends & History",
      description: "Test your understanding of F1 classic champions and historic circuits.",
      questions: [
        {
          q: "Who holds the record for the most F1 Driver Championships in history?",
          options: ["Michael Schumacher & Lewis Hamilton", "Ayrton Senna", "Sebastian Vettel", "Alain Prost"],
          answer: 0
        },
        {
          q: "Which track is known as the 'Temple of Speed'?",
          options: ["Silverstone", "Spa-Francorchamps", "Monza", "Monaco"],
          answer: 2
        },
        {
          q: "What is the unique figure-eight layout track on the calendar?",
          options: ["Marina Bay", "Suzuka", "Circuit of the Americas", "Interlagos"],
          answer: 1
        }
      ]
    }
  ];

  const handleVote = (pollId, optionIdx) => {
    if (userVotes[pollId] !== undefined) return; // User already voted
    
    setUserVotes(prev => ({
      ...prev,
      [pollId]: optionIdx
    }));

    setPolls(prevPolls => 
      prevPolls.map(p => {
        if (p.id !== pollId) return p;
        return {
          ...p,
          options: p.options.map((opt, idx) => {
            if (idx !== optionIdx) return opt;
            return { ...opt, votes: opt.votes + 1 };
          })
        };
      })
    );
  };

  const startQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIdx(0);
    setQuizScore(0);
  };

  const handleQuizAnswer = (selectedIdx) => {
    const isCorrect = selectedIdx === activeQuiz.questions[currentQuestionIdx].answer;
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
    }

    if (currentQuestionIdx + 1 < activeQuiz.questions.length) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      // Completed
      setCurrentQuestionIdx(-1);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <section className="py-24 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 text-center space-y-6">
          <div className="inline-flex items-center space-x-4">
            <div className="w-1 h-12 bg-red-600"></div>
            <h1 className="text-4xl md:text-6xl font-extralight text-gray-900 dark:text-white tracking-tight">
              Fan Zone
            </h1>
            <div className="w-1 h-12 bg-red-600"></div>
          </div>
          <p className="text-lg text-gray-500 dark:text-gray-400 font-light max-w-xl mx-auto">
            Interact with polls, cast your votes, and test your Formula 1 knowledge.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-12 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 gap-px bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            <button
              onClick={() => setActiveTab("polls")}
              className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-300 font-light text-lg ${
                activeTab === "polls" 
                  ? "bg-gray-50 dark:bg-gray-900 text-red-600 dark:text-red-400" 
                  : "bg-white dark:bg-gray-950 text-gray-900 dark:text-white"
              }`}
            >
              Fan Polls
            </button>
            <button
              onClick={() => setActiveTab("quizzes")}
              className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-300 font-light text-lg ${
                activeTab === "quizzes" 
                  ? "bg-gray-50 dark:bg-gray-900 text-red-600 dark:text-red-400" 
                  : "bg-white dark:bg-gray-950 text-gray-900 dark:text-white"
              }`}
            >
              F1 Trivia Quiz
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          
          {/* Polls tab */}
          {activeTab === "polls" && (
            <div className="space-y-8">
              {polls.map((poll) => {
                const totalVotes = poll.options.reduce((sum, o) => sum + o.votes, 0);
                const hasVoted = userVotes[poll.id] !== undefined;

                return (
                  <div key={poll.id} className="border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl p-8 space-y-6">
                    <h3 className="text-xl font-light text-gray-900 dark:text-white">{poll.question}</h3>
                    
                    <div className="space-y-3">
                      {poll.options.map((option, idx) => {
                        const percent = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
                        const isUserChoice = userVotes[poll.id] === idx;

                        return (
                          <div 
                            key={idx}
                            onClick={() => handleVote(poll.id, idx)}
                            className={`relative overflow-hidden border rounded-lg p-4 cursor-pointer transition-all ${
                              hasVoted 
                                ? (isUserChoice ? "border-red-600 bg-red-500/5" : "border-gray-100 dark:border-gray-850 bg-gray-50/50 dark:bg-gray-900/50")
                                : "border-gray-200 dark:border-gray-800 hover:border-red-600/50 bg-white dark:bg-gray-950"
                            }`}
                          >
                            {/* Animated progress bar */}
                            {hasVoted && (
                              <div 
                                className="absolute left-0 top-0 bottom-0 bg-red-600/10 transition-all duration-1000"
                                style={{ width: `${percent}%` }}
                              ></div>
                            )}

                            <div className="relative flex justify-between items-center text-sm font-light text-gray-900 dark:text-gray-300">
                              <span className="font-normal">{option.text}</span>
                              {hasVoted && (
                                <span className="font-semibold text-red-600">
                                  {percent}% ({option.votes} votes)
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Quizzes tab */}
          {activeTab === "quizzes" && (
            <div className="grid md:grid-cols-2 gap-6">
              {quizzes.map((quiz) => (
                <div key={quiz.id} className="border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl p-8 space-y-6 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="text-xl font-light text-gray-900 dark:text-white">{quiz.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-light leading-relaxed">{quiz.description}</p>
                    <span className="inline-block bg-red-50 dark:bg-red-950/20 text-red-600 text-xs px-2.5 py-1 rounded">
                      {quiz.questions.length} Questions
                    </span>
                  </div>

                  <button
                    onClick={() => startQuiz(quiz)}
                    className="w-full text-center px-4 py-2 border border-red-600 text-red-600 dark:border-red-400 dark:text-red-400 hover:bg-red-600 hover:text-white dark:hover:bg-red-400 dark:hover:text-black transition-all rounded text-sm"
                  >
                    Start Quiz
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* Quiz Modal Overlay */}
      {activeQuiz && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 max-w-md w-full rounded-xl p-8 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-800">
              <h4 className="text-lg font-light text-gray-900 dark:text-white">{activeQuiz.title}</h4>
              <button 
                onClick={() => setActiveQuiz(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {currentQuestionIdx >= 0 ? (
              <div className="space-y-6">
                {/* Question index */}
                <div className="text-xs text-gray-400 uppercase tracking-widest">
                  Question {currentQuestionIdx + 1} of {activeQuiz.questions.length}
                </div>
                
                <h5 className="text-lg font-normal text-gray-900 dark:text-white">
                  {activeQuiz.questions[currentQuestionIdx].q}
                </h5>

                <div className="space-y-3">
                  {activeQuiz.questions[currentQuestionIdx].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuizAnswer(idx)}
                      className="w-full text-left p-4 border border-gray-200 dark:border-gray-800 hover:border-red-600 rounded-lg text-sm font-light text-gray-800 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-850 transition-all"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              // Results screen
              <div className="text-center space-y-6 py-6">
                <div className="text-6xl">🏁</div>
                <h5 className="text-2xl font-light text-gray-900 dark:text-white">Quiz Completed!</h5>
                <p className="text-lg text-gray-500 font-light">
                  Your Score: <span className="font-semibold text-red-600">{quizScore} / {activeQuiz.questions.length}</span>
                </p>
                <div className="flex justify-center space-x-4 pt-4">
                  <button
                    onClick={() => startQuiz(activeQuiz)}
                    className="px-6 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                  >
                    Play Again
                  </button>
                  <button
                    onClick={() => setActiveQuiz(null)}
                    className="px-6 py-2 border border-gray-200 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-400 rounded hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Polls;

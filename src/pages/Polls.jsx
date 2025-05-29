"use client"

import { useState } from "react"
import PollWidget from "../components/PollWidget"

const Polls = () => {
  const [activeTab, setActiveTab] = useState("polls")

  const polls = [
    {
      id: 1,
      question: "Who will win the 2024 Drivers' Championship?",
      options: [
        { text: "Max Verstappen", votes: 1247 },
        { text: "Lando Norris", votes: 892 },
        { text: "Charles Leclerc", votes: 634 },
        { text: "Other", votes: 127 },
      ],
    },
    {
      id: 2,
      question: "Which team will win the Constructors' Championship?",
      options: [
        { text: "McLaren", votes: 1156 },
        { text: "Red Bull Racing", votes: 987 },
        { text: "Ferrari", votes: 743 },
        { text: "Mercedes", votes: 214 },
      ],
    },
    {
      id: 3,
      question: "Best rookie driver of 2024?",
      options: [
        { text: "Oliver Bearman", votes: 456 },
        { text: "Franco Colapinto", votes: 623 },
        { text: "Liam Lawson", votes: 389 },
        { text: "Other", votes: 132 },
      ],
    },
  ]

  const quizzes = [
    {
      id: 1,
      title: "F1 2024 Season Quiz",
      description: "Test your knowledge of the 2024 Formula 1 season",
      questions: 15,
      difficulty: "Medium",
      category: "Current Season",
      participants: 2847,
      averageScore: 78,
    },
    {
      id: 2,
      title: "F1 Legends Quiz",
      description: "How well do you know F1 history and legendary drivers?",
      questions: 20,
      difficulty: "Hard",
      category: "History",
      participants: 1923,
      averageScore: 65,
    },
    {
      id: 3,
      title: "Technical F1 Quiz",
      description: "Test your understanding of F1 car technology and regulations",
      questions: 12,
      difficulty: "Expert",
      category: "Technical",
      participants: 1456,
      averageScore: 52,
    },
    {
      id: 4,
      title: "Circuit Knowledge Quiz",
      description: "How well do you know the F1 calendar circuits?",
      questions: 18,
      difficulty: "Easy",
      category: "Circuits",
      participants: 3421,
      averageScore: 82,
    },
  ]

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "hard":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "expert":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">Fan Polls & Quizzes</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Engage with the F1 community through polls, predictions, and knowledge tests
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("polls")}
              className={`flex-1 py-3 px-6 rounded-md font-semibold transition-colors ${
                activeTab === "polls"
                  ? "bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              📊 Polls & Predictions
            </button>
            <button
              onClick={() => setActiveTab("quizzes")}
              className={`flex-1 py-3 px-6 rounded-md font-semibold transition-colors ${
                activeTab === "quizzes"
                  ? "bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              🧠 Knowledge Quizzes
            </button>
          </div>
        </div>

        {/* Polls Tab */}
        {activeTab === "polls" && (
          <div className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {polls.map((poll) => (
                <PollWidget key={poll.id} poll={poll} />
              ))}
            </div>

            {/* Create Poll CTA */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-8 text-white text-center">
              <h2 className="text-2xl font-bold mb-4">Have a Question for the Community?</h2>
              <p className="text-red-100 mb-6">
                Create your own poll and see what fellow F1 fans think about the latest topics.
              </p>
              <button className="bg-yellow-400 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors">
                Create New Poll
              </button>
            </div>
          </div>
        )}

        {/* Quizzes Tab */}
        {activeTab === "quizzes" && (
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{quiz.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{quiz.description}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(quiz.difficulty)}`}
                    >
                      {quiz.difficulty}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Questions:</span>
                      <div className="font-semibold text-gray-900 dark:text-white">{quiz.questions}</div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Category:</span>
                      <div className="font-semibold text-gray-900 dark:text-white">{quiz.category}</div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Participants:</span>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {quiz.participants.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Avg Score:</span>
                      <div className="font-semibold text-gray-900 dark:text-white">{quiz.averageScore}%</div>
                    </div>
                  </div>

                  <button className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                    Start Quiz
                  </button>
                </div>
              ))}
            </div>

            {/* Quiz Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                Community Quiz Statistics
              </h2>
              <div className="grid md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
                    {quizzes.reduce((total, quiz) => total + quiz.participants, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Participants</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">{quizzes.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Available Quizzes</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
                    {Math.round(quizzes.reduce((total, quiz) => total + quiz.averageScore, 0) / quizzes.length)}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Average Score</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
                    {quizzes.reduce((total, quiz) => total + quiz.questions, 0)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Questions</div>
                </div>
              </div>
            </div>

            {/* Leaderboard Preview */}
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl p-8 text-black">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">🏆 Weekly Leaderboard</h2>
                <p className="mb-6">Compete with other F1 fans and climb the weekly quiz leaderboard!</p>
                <button className="bg-black text-yellow-400 px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                  View Full Leaderboard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Polls

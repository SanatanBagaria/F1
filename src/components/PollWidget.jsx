"use client"

import { useState } from "react"

const PollWidget = ({ poll }) => {
  const [selectedOption, setSelectedOption] = useState(null)
  const [hasVoted, setHasVoted] = useState(false)

  const handleVote = () => {
    if (selectedOption !== null) {
      setHasVoted(true)
      // Here you would typically send the vote to your backend
    }
  }

  const getTotalVotes = () => {
    return poll.options.reduce((total, option) => total + option.votes, 0)
  }

  const getPercentage = (votes) => {
    const total = getTotalVotes()
    return total > 0 ? Math.round((votes / total) * 100) : 0
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-2xl">📊</span>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{poll.question}</h3>
      </div>

      {!hasVoted ? (
        <div className="space-y-3">
          {poll.options.map((option, index) => (
            <label
              key={index}
              className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                selectedOption === index
                  ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                  : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
              }`}
            >
              <input
                type="radio"
                name={`poll-${poll.id}`}
                value={index}
                checked={selectedOption === index}
                onChange={() => setSelectedOption(index)}
                className="sr-only"
              />
              <div
                className={`w-4 h-4 rounded-full border-2 mr-3 ${
                  selectedOption === index ? "border-red-500 bg-red-500" : "border-gray-300 dark:border-gray-600"
                }`}
              >
                {selectedOption === index && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>}
              </div>
              <span className="text-gray-900 dark:text-white">{option.text}</span>
            </label>
          ))}

          <button
            onClick={handleVote}
            disabled={selectedOption === null}
            className={`w-full py-3 rounded-lg font-semibold transition-colors ${
              selectedOption !== null
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            }`}
          >
            Vote
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {poll.options.map((option, index) => (
            <div key={index} className="relative">
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-900 dark:text-white">{option.text}</span>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {getPercentage(option.votes)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${
                    selectedOption === index ? "bg-red-600" : "bg-gray-400"
                  }`}
                  style={{ width: `${getPercentage(option.votes)}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{option.votes} votes</div>
            </div>
          ))}

          <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
            Total votes: {getTotalVotes()}
          </div>
        </div>
      )}
    </div>
  )
}

export default PollWidget

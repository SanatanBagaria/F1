const DriverRadio = () => {
  const radioMessages = [
    {
      id: 1,
      driver: "Max Verstappen",
      team: "Red Bull Racing",
      message: "That was a good move, guys. Car feels great!",
      race: "Brazilian GP 2024",
      timestamp: "2024-11-03T15:30:00Z",
    },
    {
      id: 2,
      driver: "Lewis Hamilton",
      team: "Mercedes",
      message: "Bono, my tyres are gone!",
      race: "British GP 2024",
      timestamp: "2024-07-07T14:45:00Z",
    },
    {
      id: 3,
      driver: "Charles Leclerc",
      team: "Ferrari",
      message: "I am stupid! I am stupid!",
      race: "Azerbaijan GP 2024",
      timestamp: "2024-04-28T13:20:00Z",
    },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Minimal Header */}
      <section className="py-24 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center space-x-4">
              <div className="w-1 h-12 bg-red-600"></div>
              <h1 className="text-4xl md:text-6xl font-extralight text-gray-900 dark:text-white tracking-tight">
                Radio
              </h1>
              <div className="w-1 h-12 bg-red-600"></div>
            </div>
            <p className="text-lg text-gray-500 dark:text-gray-400 font-light">
              Team communications
            </p>
          </div>
        </div>
      </section>

      {/* Messages */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-px bg-gray-100 dark:bg-gray-800">
            {radioMessages.map((message) => (
              <div 
                key={message.id} 
                className="group bg-white dark:bg-gray-950 p-12 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-300"
              >
                <div className="space-y-6">
                  {/* Driver Info */}
                  <div className="flex items-center space-x-4">
                    <div className="w-1 h-8 bg-red-600"></div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-light text-gray-900 dark:text-white">
                        {message.driver}
                      </h3>
                      <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400 font-light">
                        <span>{message.team}</span>
                        <div className="w-px h-3 bg-gray-300 dark:bg-gray-700"></div>
                        <span>{message.race}</span>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <blockquote className="text-lg text-gray-600 dark:text-gray-400 font-light italic leading-relaxed pl-5 border-l border-gray-200 dark:border-gray-800">
                    "{message.message}"
                  </blockquote>

                  {/* Play Button */}
                  <button className="group/btn inline-flex items-center space-x-3 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors font-light">
                    <span>Play</span>
                    <div className="w-4 h-px bg-gray-300 dark:bg-gray-700 group-hover/btn:bg-red-600 dark:group-hover/btn:bg-red-400 transition-colors"></div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Minimal Footer Info */}
      <section className="py-24 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-2xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-2xl font-extralight text-gray-900 dark:text-white">
            Iconic Moments
          </h2>
          <p className="text-gray-500 dark:text-gray-400 font-light leading-relaxed">
            Team radio captures the raw emotion and intensity of Formula 1. 
            These communications between drivers and their teams reveal the human side of racing.
          </p>
          <div className="w-12 h-px bg-red-600 mx-auto"></div>
        </div>
      </section>
    </div>
  )
}

export default DriverRadio

import { Link } from "react-router-dom"

const LandingPage = () => {
  const features = [
    {
      title: "Live Standings",
      description: "Real-time championship data",
      link: "/standings",
    },
    {
      title: "Race Calendar",
      description: "Complete season schedule",
      link: "/schedule",
    },
    {
      title: "Live Coverage",
      description: "Real-time race updates",
      link: "/live",
    },
    {
      title: "Race Archive",
      description: "Historical race results",
      link: "/race-histories",
    },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Ultra-Minimal Hero with Animations */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-12">
          {/* Minimal Branding with Fade-in Animation */}
          <div className="space-y-6 animate-fade-in">
            <div className="inline-flex items-center space-x-4">
              <div className="w-1 h-16 bg-red-600 animate-slide-in-left"></div>
              <h1 className="text-6xl md:text-8xl font-extralight text-gray-900 dark:text-white tracking-tight animate-fade-in-up">
                F1
              </h1>
              <div className="w-1 h-16 bg-red-600 animate-slide-in-right"></div>
            </div>
            <p className="text-lg text-gray-500 dark:text-gray-400 font-light max-w-md mx-auto animate-fade-in-up-delay">
              Formula 1 data, simplified
            </p>
          </div>

          {/* Single CTA with Hover Animation */}
          <div className="animate-fade-in-up-delay-2">
            <Link
              to="/standings"
              className="inline-block px-8 py-3 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 hover:border-red-600 dark:hover:border-red-400 transition-all duration-500 font-light tracking-wide hover:scale-105 hover:shadow-lg hover:shadow-red-600/10"
            >
              Enter
            </Link>
          </div>
        </div>

        {/* Animated scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-slow">
          <div className="w-px h-8 bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
        </div>
      </section>

      {/* Features - Grid Layout with Stagger Animation */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100 dark:bg-gray-800">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className={`group bg-white dark:bg-gray-950 p-12 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all duration-500 hover:scale-105 animate-fade-in-up`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="space-y-4">
                  <h3 className="text-lg font-light text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-light">
                    {feature.description}
                  </p>
                  <div className="w-6 h-px bg-gray-200 dark:bg-gray-800 group-hover:bg-red-600 dark:group-hover:bg-red-400 transition-all duration-300 group-hover:w-12"></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Minimal About with Slide-in Animation */}
      <section className="py-24 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-slide-in-left-slow">
              <div className="space-y-4">
                <h2 className="text-3xl font-extralight text-gray-900 dark:text-white">
                  Since 1950
                </h2>
                <div className="w-12 h-px bg-red-600 animate-expand"></div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                The pinnacle of motorsport. Twenty drivers, ten teams, one championship.
              </p>
            </div>
            
            <div className="space-y-8 animate-slide-in-right-slow">
              <div className="grid grid-cols-2 gap-8">
                <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                  <div className="text-2xl font-light text-gray-900 dark:text-white animate-count-up">23</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Races</div>
                </div>
                <div className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                  <div className="text-2xl font-light text-gray-900 dark:text-white animate-count-up">10</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Teams</div>
                </div>
                <div className="animate-fade-in-up" style={{ animationDelay: '600ms' }}>
                  <div className="text-2xl font-light text-gray-900 dark:text-white animate-count-up">20</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Drivers</div>
                </div>
                <div className="animate-fade-in-up" style={{ animationDelay: '800ms' }}>
                  <div className="text-2xl font-light text-gray-900 dark:text-white animate-count-up">75</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Years</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Footer CTA with Fade-in */}
      <section className="py-24 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-2xl mx-auto px-4 text-center space-y-8 animate-fade-in-up">
          <h2 className="text-2xl font-extralight text-gray-900 dark:text-white">
            Ready?
          </h2>
          <div className="flex justify-center space-x-8">
            <Link
              to="/live"
              className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 font-light hover:scale-110 hover:tracking-wide"
            >
              Live
            </Link>
            <Link
              to="/schedule"
              className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 font-light hover:scale-110 hover:tracking-wide"
            >
              Schedule
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage

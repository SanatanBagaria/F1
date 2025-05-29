const NewsCard = ({ article, featured = false }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getCategoryColor = (category) => {
    switch (category.toLowerCase()) {
      case "breaking":
        return "bg-red-600 text-white"
      case "race":
        return "bg-green-600 text-white"
      case "technical":
        return "bg-blue-600 text-white"
      case "driver":
        return "bg-purple-600 text-white"
      case "team":
        return "bg-orange-600 text-white"
      default:
        return "bg-gray-600 text-white"
    }
  }

  if (featured) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="relative">
          <img
            src={article.image || "/placeholder.svg?height=300&width=600"}
            alt={article.title}
            className="w-full h-64 object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(article.category)}`}>
              {article.category}
            </span>
          </div>
          {article.breaking && (
            <div className="absolute top-4 right-4">
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                BREAKING
              </span>
            </div>
          )}
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">{article.title}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{article.excerpt}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {article.author.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{article.author}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(article.date)}</p>
              </div>
            </div>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
              Read More
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative">
        <img
          src={article.image || "/placeholder.svg?height=200&width=400"}
          alt={article.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(article.category)}`}>
            {article.category}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">{article.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">{article.excerpt}</p>
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{article.author}</span>
          <span>{formatDate(article.date)}</span>
        </div>
      </div>
    </div>
  )
}

export default NewsCard

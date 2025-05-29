"use client"

import { useState } from "react"
import NewsCard from "../components/NewsCard"

const News = () => {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const categories = ["all", "breaking", "race", "technical", "driver", "team", "regulation"]

  const newsArticles = [
    {
      id: 1,
      title: "Verstappen Clinches Fourth Consecutive World Championship",
      excerpt:
        "Max Verstappen secures his fourth consecutive Formula 1 World Championship with a dominant performance in Las Vegas, cementing his place among the sport's greatest drivers.",
      category: "breaking",
      author: "Sarah Johnson",
      date: "2024-11-23",
      image: "/placeholder.svg?height=300&width=600",
      breaking: true,
      featured: true,
    },
    {
      id: 2,
      title: "McLaren Leads Constructors' Championship Battle",
      excerpt:
        "With just two races remaining, McLaren holds a narrow lead over Ferrari and Red Bull in one of the closest constructors' championship fights in recent memory.",
      category: "team",
      author: "Mike Thompson",
      date: "2024-11-22",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 3,
      title: "New Technical Regulations for 2025 Season Announced",
      excerpt:
        "The FIA has unveiled significant technical regulation changes for the 2025 season, focusing on improved sustainability and closer racing.",
      category: "technical",
      author: "Emma Davis",
      date: "2024-11-21",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 4,
      title: "Hamilton Reflects on Mercedes Struggles",
      excerpt:
        "Lewis Hamilton opens up about Mercedes' challenging 2024 season and his hopes for improvement in the final races of the year.",
      category: "driver",
      author: "James Wilson",
      date: "2024-11-20",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 5,
      title: "Las Vegas GP: Circuit Changes Improve Racing",
      excerpt:
        "Modifications to the Las Vegas street circuit have resulted in more overtaking opportunities and closer racing, according to drivers and teams.",
      category: "race",
      author: "Lisa Chen",
      date: "2024-11-19",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 6,
      title: "Rookie Drivers Making Their Mark in 2024",
      excerpt:
        "A look at how the 2024 rookie class has performed in their debut Formula 1 season, with several standout performances throughout the year.",
      category: "driver",
      author: "Robert Martinez",
      date: "2024-11-18",
      image: "/placeholder.svg?height=200&width=400",
    },
  ]

  const filteredArticles = newsArticles.filter((article) => {
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const featuredArticle = filteredArticles.find((article) => article.featured)
  const regularArticles = filteredArticles.filter((article) => !article.featured)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">F1 News</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">Latest Formula 1 news, updates, and analysis</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search news articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                  selectedCategory === category
                    ? "bg-red-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {category === "all" ? "All News" : category}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Article */}
        {featuredArticle && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Featured Story</h2>
            <NewsCard article={featuredArticle} featured={true} />
          </div>
        )}

        {/* Regular Articles */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Latest News</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularArticles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📰</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No articles found</h3>
            <p className="text-gray-600 dark:text-gray-300">Try adjusting your search or filter criteria.</p>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mt-16 bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-8 text-white">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Stay Updated with F1 News</h2>
            <p className="text-red-100 mb-6">
              Get the latest Formula 1 news, race updates, and exclusive content delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <button className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default News

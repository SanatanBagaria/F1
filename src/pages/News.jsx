import React, { useState, useEffect } from "react";
import NewsCard from "../components/NewsCard";

const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = ["all", "breaking", "race", "technical", "driver", "team"];

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const response = await fetch(`${API_BASE_URL}/api/news`);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to fetch news`);
        }
        const data = await response.json();
        setArticles(data);
      } catch (err) {
        console.error("Failed to load news, using cached fallback data:", err);
        setError("Offline mode: showing curated news archive.");
        // Cached Fallback
        setArticles([
          {
            id: 1,
            title: "Verstappen Clinches Fourth Consecutive World Championship",
            excerpt: "Max Verstappen secures his fourth consecutive Formula 1 World Championship with a dominant performance, cementing his place among the sport's greatest drivers.",
            category: "breaking",
            author: "Sarah Johnson",
            date: new Date().toISOString().split('T')[0],
            image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=600",
            breaking: true,
            featured: true
          },
          {
            id: 2,
            title: "McLaren Defends Constructor Dominance Against Resurgent Ferrari",
            excerpt: "McLaren holds a narrow lead in a thrilling multi-way constructor's championship battle, pushing car upgrades to the maximum limit.",
            category: "team",
            author: "Mike Thompson",
            date: new Date().toISOString().split('T')[0],
            image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=600",
            featured: false
          },
          {
            id: 3,
            title: "Hamilton Tests Red Bull and Ferrari Mechanical Pace Ahead of Opener",
            excerpt: "Lewis Hamilton opens up about Scuderia Ferrari's simulator correlations and engine maps ahead of the highly anticipated season opener.",
            category: "driver",
            author: "Emma Davis",
            date: new Date().toISOString().split('T')[0],
            image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=600",
            featured: false
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const filteredArticles = articles.filter((article) => {
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticle = filteredArticles.find((article) => article.featured) || filteredArticles[0];
  const regularArticles = filteredArticles.filter((article) => article.id !== featuredArticle?.id);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-1 h-16 bg-red-600 mx-auto animate-pulse"></div>
          <h2 className="text-xl font-extralight text-gray-900 dark:text-white">Loading News Feed...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <section className="py-24 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-1 h-12 bg-red-600"></div>
              <h1 className="text-4xl md:text-5xl font-extralight text-gray-900 dark:text-white tracking-tight">
                News
              </h1>
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-light">
              Aggregated real-time updates and articles from F1 RSS.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white dark:bg-gray-905 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded px-4 py-2 text-sm focus:border-red-600 focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* Category selector */}
      <section className="py-8 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded text-xs font-light uppercase tracking-wider transition-all ${
                selectedCategory === cat
                  ? "bg-red-600 text-white"
                  : "bg-gray-50 dark:bg-gray-900 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-850"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 space-y-12">
          
          {/* Featured Article */}
          {featuredArticle && (
            <div 
              onClick={() => window.open(featuredArticle.link, "_blank")}
              className="group cursor-pointer grid lg:grid-cols-2 gap-8 border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300"
            >
              <img
                src={featuredArticle.image}
                alt={featuredArticle.title}
                className="w-full h-80 lg:h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="p-8 lg:p-12 flex flex-col justify-center space-y-6">
                <span className="text-xs uppercase tracking-widest text-red-600 font-semibold">{featuredArticle.category}</span>
                <h2 className="text-3xl font-light text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                  {featuredArticle.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-light leading-relaxed">{featuredArticle.excerpt}</p>
                <div className="text-xs text-gray-400 font-light">
                  By {featuredArticle.author} • {featuredArticle.date}
                </div>
              </div>
            </div>
          )}

          {/* Grid of regular articles */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularArticles.map((article) => (
              <div 
                key={article.id}
                onClick={() => window.open(article.link, "_blank")}
                className="group cursor-pointer border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col"
              >
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <span className="text-[10px] uppercase tracking-widest text-red-600 font-semibold">{article.category}</span>
                    <h3 className="text-lg font-light text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-light line-clamp-3 leading-relaxed">{article.excerpt}</p>
                  </div>
                  <div className="text-[10px] text-gray-400 font-light border-t border-gray-50 dark:border-gray-800/40 pt-3">
                    By {article.author} • {article.date}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
};

export default News;

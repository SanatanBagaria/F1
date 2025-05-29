// API utility functions for common operations

// Generic fetch wrapper with error handling and retries
export const fetchWithRetry = async (url, options = {}, maxRetries = 3) => {
  const defaultOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...options
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, defaultOptions)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return response
    } catch (error) {
      console.warn(`Fetch attempt ${attempt} failed for ${url}:`, error.message)
      
      if (attempt === maxRetries) {
        throw new Error(`Failed to fetch ${url} after ${maxRetries} attempts: ${error.message}`)
      }
      
      // Wait before retrying (exponential backoff)
      await delay(Math.pow(2, attempt) * 1000)
    }
  }
}

// Delay utility for retries
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Batch API calls with concurrency limit
export const batchApiCalls = async (apiCalls, concurrencyLimit = 5) => {
  const results = []
  
  for (let i = 0; i < apiCalls.length; i += concurrencyLimit) {
    const batch = apiCalls.slice(i, i + concurrencyLimit)
    const batchResults = await Promise.allSettled(batch.map(call => call()))
    results.push(...batchResults)
  }
  
  return results
}

// Cache management utilities
export class ApiCache {
  constructor(ttl = 5 * 60 * 1000) { // 5 minutes default TTL
    this.cache = new Map()
    this.ttl = ttl
  }

  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  get(key) {
    const cached = this.cache.get(key)
    if (!cached) return null

    if (Date.now() - cached.timestamp > this.ttl) {
      this.cache.delete(key)
      return null
    }

    return cached.data
  }

  clear() {
    this.cache.clear()
  }

  has(key) {
    const cached = this.cache.get(key)
    if (!cached) return false
    
    if (Date.now() - cached.timestamp > this.ttl) {
      this.cache.delete(key)
      return false
    }
    
    return true
  }
}

// Create a global cache instance
export const globalApiCache = new ApiCache()

// Cached fetch wrapper
export const fetchWithCache = async (url, options = {}, cacheKey = null) => {
  const key = cacheKey || url
  
  // Check cache first
  const cached = globalApiCache.get(key)
  if (cached) {
    console.log(`Cache hit for ${key}`)
    return cached
  }
  
  // Fetch and cache
  const response = await fetchWithRetry(url, options)
  const data = await response.json()
  
  globalApiCache.set(key, data)
  console.log(`Cached response for ${key}`)
  
  return data
}

// URL builder utility
export const buildApiUrl = (baseUrl, endpoint, params = {}) => {
  const url = new URL(endpoint, baseUrl)
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      url.searchParams.append(key, value.toString())
    }
  })
  
  return url.toString()
}

// Rate limiting utility
export class RateLimiter {
  constructor(maxRequests = 10, timeWindow = 60000) { // 10 requests per minute default
    this.maxRequests = maxRequests
    this.timeWindow = timeWindow
    this.requests = []
  }

  async checkLimit() {
    const now = Date.now()
    
    // Remove old requests outside the time window
    this.requests = this.requests.filter(time => now - time < this.timeWindow)
    
    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = Math.min(...this.requests)
      const waitTime = this.timeWindow - (now - oldestRequest)
      
      console.warn(`Rate limit reached. Waiting ${waitTime}ms before next request.`)
      await delay(waitTime)
      
      return this.checkLimit() // Recursive check after waiting
    }
    
    this.requests.push(now)
    return true
  }
}

// Create a global rate limiter
export const globalRateLimiter = new RateLimiter()

// API response validator
export const validateApiResponse = (data, schema) => {
  // Basic validation - can be extended with more sophisticated schema validation
  if (!data) {
    throw new Error('API response is empty')
  }
  
  if (schema.required) {
    for (const field of schema.required) {
      if (!(field in data)) {
        throw new Error(`Required field '${field}' is missing from API response`)
      }
    }
  }
  
  return true
}

// Error handling utilities
export class ApiError extends Error {
  constructor(message, status, endpoint) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.endpoint = endpoint
  }
}

export const handleApiError = (error, endpoint) => {
  if (error instanceof ApiError) {
    throw error
  }
  
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    throw new ApiError('Network error - please check your connection', 0, endpoint)
  }
  
  throw new ApiError(error.message || 'Unknown API error', error.status || 500, endpoint)
}

// Data transformation utilities
export const transformApiResponse = (data, transformer) => {
  try {
    return transformer(data)
  } catch (error) {
    console.error('Error transforming API response:', error)
    throw new Error(`Data transformation failed: ${error.message}`)
  }
}

// Pagination utilities
export const paginateResults = (data, page = 1, limit = 20) => {
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  
  return {
    data: data.slice(startIndex, endIndex),
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(data.length / limit),
      totalItems: data.length,
      itemsPerPage: limit,
      hasNextPage: endIndex < data.length,
      hasPrevPage: page > 1
    }
  }
}

// API health check utility
export const checkApiHealth = async (baseUrl) => {
  try {
    const response = await fetch(baseUrl, { method: 'HEAD' })
    return {
      status: response.status,
      ok: response.ok,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    return {
      status: 0,
      ok: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }
  }
}

// Utility to merge multiple API responses
export const mergeApiResponses = (...responses) => {
  return responses.reduce((merged, response) => {
    if (Array.isArray(response.data)) {
      merged.data = [...(merged.data || []), ...response.data]
    } else if (typeof response.data === 'object') {
      merged.data = { ...(merged.data || {}), ...response.data }
    }
    
    merged.sources = [...(merged.sources || []), response.source]
    return merged
  }, { data: null, sources: [] })
}

// Utility to format API response for consistent structure
export const formatApiResponse = (data, source, metadata = {}) => {
  return {
    data,
    source,
    timestamp: new Date().toISOString(),
    metadata: {
      count: Array.isArray(data) ? data.length : 1,
      ...metadata
    }
  }
}

// Utility to handle concurrent API calls with error isolation
export const safeConcurrentApiCalls = async (apiCalls) => {
  const results = await Promise.allSettled(apiCalls.map(call => call()))
  
  const successful = results
    .filter(result => result.status === 'fulfilled')
    .map(result => result.value)
  
  const failed = results
    .filter(result => result.status === 'rejected')
    .map(result => result.reason)
  
  if (failed.length > 0) {
    console.warn(`${failed.length} API calls failed:`, failed)
  }
  
  return {
    successful,
    failed,
    totalCalls: apiCalls.length,
    successRate: (successful.length / apiCalls.length) * 100
  }
}

// Utility to create API endpoint URLs with proper encoding
export const createApiEndpoint = (baseUrl, path, queryParams = {}) => {
  const url = new URL(path, baseUrl)
  
  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => url.searchParams.append(key, encodeURIComponent(v)))
      } else {
        url.searchParams.append(key, encodeURIComponent(value))
      }
    }
  })
  
  return url.toString()
}

// Utility for API request logging
export const logApiRequest = (method, url, options = {}) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`🌐 API ${method.toUpperCase()}: ${url}`, {
      timestamp: new Date().toISOString(),
      options: Object.keys(options).length > 0 ? options : undefined
    })
  }
}

// Utility for API response logging
export const logApiResponse = (url, response, duration) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`✅ API Response: ${url}`, {
      status: response.status,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    })
  }
}

// Main entry point - keeps all your existing imports working
import { F1ApiService } from './f1/base/F1ApiService.js'
export { API_SOURCES } from './f1/base/constants.js'

// Create and export the singleton instance
export const f1Api = new F1ApiService()

// Export the class as well for direct instantiation if needed
export { F1ApiService }

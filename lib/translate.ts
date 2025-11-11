import { getStaticTranslation } from './translations-dictionary'

// In-memory cache to avoid re-translating the same text
const translationCache = new Map<string, string>()

// LocalStorage cache key
const CACHE_KEY = 'votehubph_translations'
const CACHE_VERSION = '1.0'

// Load cache from localStorage on startup
function loadCacheFromStorage(): void {
  if (typeof window === 'undefined') return

  try {
    const stored = localStorage.getItem(CACHE_KEY)
    if (stored) {
      const { version, data } = JSON.parse(stored)
      if (version === CACHE_VERSION && data) {
        Object.entries(data).forEach(([key, value]) => {
          translationCache.set(key, value as string)
        })
      }
    }
  } catch (error) {
    console.error('Failed to load translation cache:', error)
  }
}

// Save cache to localStorage (debounced)
let saveTimeout: NodeJS.Timeout | null = null
function saveCacheToStorage(): void {
  if (typeof window === 'undefined') return

  if (saveTimeout) clearTimeout(saveTimeout)

  saveTimeout = setTimeout(() => {
    try {
      const data: Record<string, string> = {}
      translationCache.forEach((value, key) => {
        data[key] = value
      })

      localStorage.setItem(CACHE_KEY, JSON.stringify({
        version: CACHE_VERSION,
        data
      }))
    } catch (error) {
      console.error('Failed to save translation cache:', error)
    }
  }, 1000) // Debounce by 1 second
}

// Initialize cache
loadCacheFromStorage()

export async function translateText(text: string, targetLang: string): Promise<string> {
  // If target language is English, return original text
  if (targetLang === 'en') {
    return text
  }

  // Skip translation for form-related text patterns (labels, placeholders, etc.)
  const formPatterns = [
    /username or email/i,
    /email address/i,
    /password/i,
    /enter your/i,
    /select/i,
    /choose/i,
    /upload/i,
    /click to/i,
    /loading/i,
    /required/i,
    /optional/i,
    /characters/i,
    /max length/i,
    /min length/i,
  ]
  
  // Check if text matches any form pattern
  if (formPatterns.some(pattern => pattern.test(text))) {
    return text // Don't translate form labels/placeholders
  }

  // 1. Check static dictionary first (instant, no API call)
  const staticTranslation = getStaticTranslation(text, targetLang)
  if (staticTranslation) {
    return staticTranslation
  }

  // 2. Check in-memory cache
  const cacheKey = `${text}_${targetLang}`
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!
  }

  // 3. For dynamic content, use API with rate limiting protection
  try {
    // Using MyMemory Translation API (free, no API key required)
    const encodedText = encodeURIComponent(text)
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=en|${targetLang === 'fil' ? 'tl' : targetLang}`
    )

    // Handle rate limiting
    if (response.status === 429) {
      console.warn('Translation API rate limit reached, using original text:', text)
      return text // Fallback to original text instead of failing
    }

    const data = await response.json()

    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      const translated = data.responseData.translatedText
      // Store in cache
      translationCache.set(cacheKey, translated)
      saveCacheToStorage() // Persist to localStorage
      return translated
    }

    // If translation fails, return original text
    return text
  } catch (error) {
    console.error('Translation error:', error)
    return text
  }
}

// Batch translate multiple texts with intelligent rate limiting
export async function translateBatch(texts: string[], targetLang: string): Promise<string[]> {
  if (targetLang === 'en') {
    return texts
  }

  // Translate with delay between API calls to avoid rate limiting
  const results: string[] = []
  let apiCallCount = 0
  const MAX_CONCURRENT_API_CALLS = 3

  for (const text of texts) {
    // Check if we need API call (not in static dict or cache)
    const staticTranslation = getStaticTranslation(text, targetLang)
    const cacheKey = `${text}_${targetLang}`

    if (staticTranslation || translationCache.has(cacheKey)) {
      // Use cached/static translation immediately
      results.push(await translateText(text, targetLang))
    } else {
      // Need API call - add delay to avoid rate limiting
      if (apiCallCount >= MAX_CONCURRENT_API_CALLS) {
        await new Promise(resolve => setTimeout(resolve, 1000)) // 1 second delay
        apiCallCount = 0
      }
      results.push(await translateText(text, targetLang))
      apiCallCount++
    }
  }

  return results
}

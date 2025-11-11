"use client"

import { useEffect, useState } from "react"
import { translateText } from "./translate"
import { useLanguage } from "./language-context"

export function useTranslate(text: string | undefined | null): string {
  const { language } = useLanguage()
  const [translated, setTranslated] = useState(text || "")
  const [isTranslating, setIsTranslating] = useState(false)

  useEffect(() => {
    if (!text) {
      setTranslated("")
      return
    }

    // If English or text hasn't changed, just set it
    if (language === "en") {
      setTranslated(text)
      return
    }

    // Translate to target language
    const doTranslate = async () => {
      setIsTranslating(true)
      try {
        const result = await translateText(text, language)
        setTranslated(result)
      } catch (error) {
        console.error("Translation failed:", error)
        setTranslated(text) // Fallback to original text
      } finally {
        setIsTranslating(false)
      }
    }

    doTranslate()
  }, [text, language])

  return translated
}

// For translating arrays of text
export function useTranslateArray(texts: (string | undefined | null)[]): string[] {
  const { language } = useLanguage()
  const [translated, setTranslated] = useState<string[]>(texts.map(t => t || ""))

  useEffect(() => {
    if (language === "en") {
      setTranslated(texts.map(t => t || ""))
      return
    }

    const doTranslate = async () => {
      const validTexts = texts.map(t => t || "")
      const promises = validTexts.map(text =>
        text ? translateText(text, language) : Promise.resolve("")
      )

      try {
        const results = await Promise.all(promises)
        setTranslated(results)
      } catch (error) {
        console.error("Batch translation failed:", error)
        setTranslated(validTexts)
      }
    }

    doTranslate()
  }, [texts.join(","), language])

  return translated
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { T } from "@/components/auto-translate"
import { useTranslate } from "@/lib/use-translate"
import { useLanguage } from "@/lib/language-context"

export default function TranslationDemo() {
  const { language } = useLanguage()
  const candidateBio = useTranslate(
    "John Doe has been serving the community for over 20 years. He advocates for better education and healthcare."
  )

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>
            <T>Automatic Translation Demo</T>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Current Language: {language === "en" ? "English" : "Filipino"}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">
              <T>Candidate Biography</T>
            </h3>
            <p className="text-muted-foreground">{candidateBio}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">
              <T>Platform Points</T>
            </h3>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <T>Improve public transportation</T>
              </li>
              <li>
                <T>Build more schools and hospitals</T>
              </li>
              <li>
                <T>Create job opportunities for youth</T>
              </li>
            </ul>
          </div>

          <p className="text-sm text-muted-foreground">
            <T>
              Change the language in Settings to see automatic translation to Tagalog!
            </T>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

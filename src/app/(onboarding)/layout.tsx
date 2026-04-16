import { LanguageProvider } from '@/contexts/LanguageContext'

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <LanguageProvider>{children}</LanguageProvider>
}

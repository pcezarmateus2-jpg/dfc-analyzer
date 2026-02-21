import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DFC Analyzer - Análise Financeira com IA',
  description: 'Analise seu fluxo de caixa com inteligência artificial',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}

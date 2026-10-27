import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { FileQuestion, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/40 rounded-full flex items-center justify-center mx-auto text-[#0b99ff]">
            <FileQuestion className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Page or Article Not Found
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            The requested document, article, or resource could not be found or has not yet been published.
          </p>
          <div className="pt-2">
            <Link href="/">
              <Button className="bg-[#0b99ff] hover:bg-[#0088e0] text-white font-medium text-xs rounded-lg">
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                Return to Scholarly Open Home
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

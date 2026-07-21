"use client"

import { useState } from "react"
import { Calculator, Award, Gift, DollarSign, ShieldAlert } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

export function ReviewerCalculator() {
  const [reviewsPerYear, setReviewsPerYear] = useState<number>(4)

  const creditsPerReview = 50 // €50 equivalent
  const hoursPerReview = 6 // Average hours spent

  const totalCredits = reviewsPerYear * creditsPerReview
  const totalHours = reviewsPerYear * hoursPerReview
  const apcDiscountPercent = Math.min(100, Math.round((totalCredits / 1500) * 100)) // Assuming average APC is 1500

  return (
    <Card className="border border-primary/20 bg-card/60 backdrop-blur-sm shadow-lg overflow-hidden transition-all duration-300 hover:shadow-primary/5">
      <CardHeader className="bg-gradient-to-r from-primary/5 via-transparent to-transparent border-b border-border/40 pb-6">
        <div className="flex items-center gap-2 text-primary">
          <Calculator className="h-5 w-5 animate-pulse" />
          <CardTitle className="text-xl">Scholarly Credits Calculator</CardTitle>
        </div>
        <CardDescription className="text-sm mt-1">
          Estimate your annual contributions and calculate your token redemption potential.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm font-medium">
            <span>Manuscript Reviews Per Year</span>
            <span className="text-primary font-bold text-lg bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
              {reviewsPerYear} / 12
            </span>
          </div>

          <div className="pt-2">
            <Slider
              value={[reviewsPerYear]}
              min={1}
              max={12}
              step={1}
              onValueChange={(val) => setReviewsPerYear(val[0])}
              className="py-2"
            />
          </div>

          <div className="flex gap-2 items-center text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg border border-border/50">
            <ShieldAlert className="h-4 w-4 shrink-0 text-amber-500" />
            <span>
              <strong>Note:</strong> To prevent "review mills" and ensure high peer review standards, reviewers are capped at a maximum of <strong>1 review per month</strong>.
            </span>
          </div>
        </div>

        <hr className="border-border/40" />

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 text-center transition-all duration-300 hover:bg-primary/10">
            <div className="flex justify-center text-primary mb-2">
              <Award className="h-6 w-6" />
            </div>
            <div className="text-2xl font-bold text-primary">{totalCredits}</div>
            <div className="text-xs text-muted-foreground mt-1 font-medium">Credits Earned</div>
            <div className="text-[10px] text-muted-foreground/60">(€{totalCredits} value)</div>
          </div>

          <div className="p-4 rounded-xl bg-muted/50 border border-border/50 text-center transition-all duration-300 hover:bg-muted/80">
            <div className="flex justify-center text-muted-foreground mb-2">
              <DollarSign className="h-6 w-6" />
            </div>
            <div className="text-2xl font-bold">{apcDiscountPercent}%</div>
            <div className="text-xs text-muted-foreground mt-1 font-medium">Average APC Discount</div>
            <div className="text-[10px] text-muted-foreground/60">For your own future publications</div>
          </div>

          <div className="p-4 rounded-xl bg-muted/50 border border-border/50 text-center transition-all duration-300 hover:bg-muted/80">
            <div className="flex justify-center text-muted-foreground mb-2">
              <Gift className="h-6 w-6" />
            </div>
            <div className="text-2xl font-bold">€{totalCredits}</div>
            <div className="text-xs text-muted-foreground mt-1 font-medium">LMIC Funder Impact</div>
            <div className="text-[10px] text-muted-foreground/60">Value you can donate to peers</div>
          </div>
        </div>

        <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
          <h4 className="text-sm font-semibold mb-2">Estimated Academic Contribution:</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between border-b border-border/40 pb-1">
              <span className="text-muted-foreground">Expert Hours Dedicated:</span>
              <span className="font-semibold">{totalHours} hrs</span>
            </div>
            <div className="flex justify-between border-b border-border/40 pb-1">
              <span className="text-muted-foreground">Global Reach Impact:</span>
              <span className="font-semibold">High</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

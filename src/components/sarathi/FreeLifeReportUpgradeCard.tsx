import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function FreeLifeReportUpgradeCard() {
  return (
    <Card className="rounded-2xl border border-[color:var(--border)] astro-card shadow-xl">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          Your chart is only the beginning
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 text-sm text-foreground/80">
        <p>
          Your free preview shows your core birth-chart facts. Your complete
          Life Report explains what these placements mean for your life,
          relationships, career, money, health, spiritual path, and timing.
        </p>

        <div className="grid gap-2 sm:grid-cols-2">
          {[
            "Your deeper personality pattern",
            "Career direction and professional strengths",
            "Money and wealth tendencies",
            "Relationships and marriage pattern",
            "Current life phase",
            "Upcoming opportunities and challenges",
            "Dasha and transit timing",
            "Personalized practical guidance",
          ].map((item) => (
            <div
              key={item}
              className="flex items-center gap-2 rounded-xl border border-[color:var(--border)] bg-background p-3"
            >
              <span aria-hidden="true">🔒</span>
              <span>{item}</span>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-[color:var(--border)] bg-background p-4">
          <div className="font-semibold text-foreground">
            Free preview: Know your chart
          </div>
          <div className="mt-1 text-foreground/70">
            Full Life Report: Understand your life
          </div>
        </div>

        <Button asChild className="w-full sm:w-auto">
  <Link href="/sarathi/upgrade?product=life-report">
    Unlock Full Life Report
  </Link>
</Button>
      </CardContent>
    </Card>
  );
}

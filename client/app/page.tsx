"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";

const features = [
  {
    title: "Unified pipeline",
    description:
      "Track leads, customers, and tickets in one streamlined workspace.",
  },
  {
    title: "Team clarity",
    description: "Know who owns what with roles for sales and support teams.",
  },
  {
    title: "Actionable insights",
    description:
      "Spot momentum with dashboards for pipeline health and support load.",
  },
];

const heroStats = [
  { label: "Faster responses", value: "2.4x" },
  { label: "Pipeline lift", value: "+38%" },
  { label: "Go-live", value: "5 min" },
];

const marquee = ["Sales", "Success", "Support", "Ops", "Leadership"];

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="relative overflow-hidden bg-linear-to-br from-slate-950 via-[#0f1b2e] to-[#0c2f3a] text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        aria-hidden
      >
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,rgba(13,255,209,0.25)_0,rgba(13,255,209,0)_60%)] blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-5%] h-96 w-96 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,196,105,0.22)_0,rgba(255,196,105,0)_60%)] blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.04)_8%,transparent_8%),linear-gradient(240deg,rgba(255,255,255,0.03)_10%,transparent_10%)]" />
      </div>

      <header className="border-b border-white/10 bg-white/5 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <Image
              src="/NavIcon.png"
              width={32}
              height={32}
              alt="Nexus CRM Logo"
              className="rounded-sm"
            />
            <span className="leading-none">Nexus CRM</span>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Button
                asChild
                className="bg-emerald-400 text-slate-900 hover:bg-emerald-300"
              >
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button
                  asChild
                  variant="ghost"
                  className="text-white hover:bg-white/10"
                >
                  <Link href="/signin">Sign in</Link>
                </Button>
                <Button
                  asChild
                  className="bg-emerald-400 text-slate-900 hover:bg-emerald-300"
                >
                  <Link href="/signup">Get started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-6 pb-20 pt-12 md:pt-20">
        <section className="grid gap-12 md:grid-cols-[1.05fr_0.95fr] md:items-center">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-200 shadow-sm shadow-emerald-500/30">
              Built for decisive teams
            </div>
            <div className="space-y-5">
              <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
                Close deals faster. Support customers flawlessly.
              </h1>
              <p className="text-lg text-slate-200 sm:text-xl">
                Nexus CRM keeps every revenue motion in one canvaspipeline,
                success, and support so leadership sees clarity and teams move
                with confidence.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {isAuthenticated ? (
                <Button
                  asChild
                  size="lg"
                  className="bg-emerald-400 text-slate-950 hover:bg-emerald-300"
                >
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button
                    asChild
                    size="lg"
                    className="bg-emerald-400 text-slate-950 hover:bg-emerald-300"
                  >
                    <Link href="/signup">Start free</Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-white/30 bg-white/5 text-white hover:bg-white/10"
                  >
                    <Link href="/signin">Sign in</Link>
                  </Button>
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-emerald-100/80">
              {heroStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 shadow-sm shadow-emerald-500/20"
                >
                  <div className="text-xl font-semibold text-white">
                    {stat.value}
                  </div>
                  <div className="text-xs uppercase tracking-wide text-emerald-100/80">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Card className="border-white/20 bg-white/10 shadow-2xl shadow-emerald-500/20 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white">
                Stay ahead of every conversation
              </CardTitle>
              <CardDescription className="text-slate-200">
                Pipeline, customers, interactions, and support tickets in one
                clean view.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-100">
              <div className="rounded-lg border border-white/10 bg-white/10 p-4 shadow-sm">
                <div className="text-white font-semibold">Today</div>
                <ul className="mt-2 space-y-2">
                  <li>
                    • Follow up with{" "}
                    <span className="text-emerald-200 font-medium">
                      Startup Ventures
                    </span>
                  </li>
                  <li>
                    • Prepare QBR deck for{" "}
                    <span className="text-emerald-200 font-medium">
                      Acme Corporation
                    </span>
                  </li>
                  <li>
                    • Review new support ticket:{" "}
                    <span className="text-emerald-200 font-medium">
                      Billing discrepancy
                    </span>
                  </li>
                </ul>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/10 p-4 shadow-sm">
                <div className="text-white font-semibold">Health overview</div>
                <div className="mt-3 grid grid-cols-3 gap-3 text-center text-xs">
                  {[
                    { label: "Active leads", value: "42" },
                    { label: "Open tickets", value: "18" },
                    { label: "At risk", value: "5" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-md border border-white/10 bg-white/5 p-2"
                    >
                      <div className="text-lg font-bold text-emerald-200">
                        {item.value}
                      </div>
                      <div className="text-[11px] text-slate-200">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-16">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-emerald-100/80">
            <span className="h-px w-8 bg-emerald-300/60" /> Trusted by teams
            across
            <div className="flex items-center gap-2 overflow-hidden rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px]">
              {marquee.map((item) => (
                <span key={item} className="text-emerald-100/80">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="h-full border-white/10 bg-white/5 text-white shadow-lg shadow-emerald-500/15"
              >
                <CardHeader>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription className="text-slate-200">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

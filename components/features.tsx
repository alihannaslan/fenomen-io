"use client"
import { useTheme } from "next-themes"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { geist } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { TrendingUp, FileText, Lightbulb, BarChart3 } from "lucide-react"

export default function Features() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const { theme } = useTheme()

  const features = [
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "AI Profil Analizi",
      description: "Hesabını tarar, güçlü ve zayıf yönlerini tespit eder",
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Otomatik Raporlar",
      description: "Her ay e-posta ile AI büyüme raporu",
    },
    {
      icon: <Lightbulb className="h-8 w-8" />,
      title: "İçerik Önerileri",
      description: "En çok etkileşim alan tarzlara göre öneriler",
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Trend Analizi",
      description: "Güncel akımları takip edip senin nişine göre sunar",
    },
  ]

  return (
    <section id="features" className="text-foreground relative overflow-hidden py-12 sm:py-24 md:py-32">
      <div className="bg-primary absolute -top-10 left-1/2 h-16 w-44 -translate-x-1/2 rounded-full opacity-40 blur-3xl select-none"></div>
      <div className="via-primary/50 absolute top-0 left-1/2 h-px w-3/5 -translate-x-1/2 bg-gradient-to-r from-transparent to-transparent transition-all ease-in-out"></div>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.5, delay: 0 }}
        className="container mx-auto flex flex-col items-center gap-6 sm:gap-12"
      >
        <h2
          className={cn(
            "via-foreground mb-8 bg-gradient-to-b from-zinc-800 to-zinc-700 bg-clip-text text-center text-4xl font-semibold tracking-tighter text-transparent md:text-[54px] md:leading-[60px]",
            geist.className,
          )}
        >
          Fenomen Özellikleri
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group border-secondary/40 text-card-foreground relative flex flex-col overflow-hidden rounded-xl border-2 p-8 shadow-xl transition-all ease-in-out hover:scale-105"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{
                borderColor: "rgba(231, 138, 83, 0.6)",
                boxShadow: "0 0 30px rgba(231, 138, 83, 0.2)",
              }}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">{feature.icon}</div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  Check,
  ChevronRight,
  Menu,
  X,
  Moon,
  Sun,
  ArrowRight,
  Star,
  Shield,
  Users,
  BarChart,
  Compass,
  Sparkles,
  Target,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "next-themes"

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark")

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

  // Özellikler – hesabı büyüten yapay zekâ modülleri
  const features = [
    {
      title: "AI Büyüme Motoru",
      description:
        "Fenomen'in yapay zekâsı, içeriklerini ve etkileşim sinyallerini analiz ederek hesabını büyütmek için net öneriler üretir.",
      icon: <Sparkles className="size-5" />,
    },
    {
      title: "Akıllı Hook & Senaryo",
      description: "Nişine ve hedef kitlene göre ilk 3 saniye hook'ları, kısa senaryolar ve CTA'lar önerir.",
      icon: <Target className="size-5" />,
    },
    {
      title: "Otomatik Yol Haritası",
      description: "Haftalık görevler, gönderi takvimi ve takip edeceğin metriklerle uygulanabilir büyüme planı.",
      icon: <BarChart className="size-5" />,
    },
    {
      title: "Trend & Ses Önerileri",
      description: "Nişinde yükselen içerik açıları ve uygun ses önerileriyle üretimi hızlandırır.",
      icon: <Compass className="size-5" />,
    },
    {
      title: "Rakip Kıyas ve Fırsatlar",
      description: "Benzer creator'larla kıyaslayarak fark yaratacağın format ve konuları öne çıkarır.",
      icon: <Users className="size-5" />,
    },
    {
      title: "Marka‑Güven & Uyum",
      description: "Reklam bildirimi, riskli ifade ve uygunluk kontrolleriyle iş birliklerine hazır hale getirir.",
      icon: <Shield className="size-5" />,
    },
  ]

  return (
    <div className="flex min-h-[100dvh] flex-col">
      {/* HEADER */}
      <header className={`sticky top-0 z-50 w-full backdrop-blur-lg transition-all duration-300 ${isScrolled ? "bg-background/80 shadow-sm" : "bg-transparent"}`}>
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground">F</div>
            <span>fenomen</span>
          </div>
          <nav className="hidden md:flex gap-8">
            <Link href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Özellikler</Link>
            <Link href="#how" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Nasıl Çalışır</Link>
            <Link href="#pricing" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Fiyatlandırma</Link>
            <Link href="#faq" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">SSS</Link>
          </nav>
          <div className="hidden md:flex gap-4 items-center">
            <Badge variant="outline" className="rounded-full">Hesabını büyüten yapay zekâ</Badge>
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
              {mounted && theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
              <span className="sr-only">Temayı değiştir</span>
            </Button>
            <Link href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Giriş yap</Link>
            <Button className="rounded-full">
              Yapay zekâ ile büyümeye başla
              <ChevronRight className="ml-1 size-4" />
            </Button>
          </div>
          <div className="flex items-center gap-4 md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
              {mounted && theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              <span className="sr-only">Menüyü aç/kapat</span>
            </Button>
          </div>
        </div>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="md:hidden absolute top-16 inset-x-0 bg-background/95 backdrop-blur-lg border-b">
            <div className="container py-4 flex flex-col gap-4">
              <Link href="#features" className="py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>Özellikler</Link>
              <Link href="#how" className="py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>Nasıl Çalışır</Link>
              <Link href="#pricing" className="py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>Fiyatlandırma</Link>
              <Link href="#faq" className="py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>SSS</Link>
              <div className="flex flex-col gap-2 pt-2 border-t">
                <Link href="#" className="py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>Giriş yap</Link>
                <Button className="rounded-full">Yapay zekâ ile büyümeye başla<ChevronRight className="ml-1 size-4" /></Button>
              </div>
            </div>
          </motion.div>
        )}
      </header>

      <main className="flex-1">
        {/* HERO */}
        <section className="w-full py-20 md:py-32 lg:py-40 overflow-hidden">
          <div className="container px-4 md:px-6 relative">
            <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center max-w-4xl mx-auto mb-12">
              <Badge className="mb-4 rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">Yeni • Hesabını büyüten yapay zekâ</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                Yapay zekâ ile hesabını büyüt
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Fenomen, içeriklerini analiz ederek profil skorunu, kullanman gereken hook’ları ve üretim planını çıkarır.
                Yapay zekâ her ay kendini günceller; öneriler gelişir, hesabın büyür.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="rounded-full h-12 px-8 text-base">Yapay zekâ ile büyümeye başla<ArrowRight className="ml-2 size-4" /></Button>
                <Button size="lg" variant="outline" className="rounded-full h-12 px-8 text-base">Örnek AI raporu</Button>
              </div>
              <div className="flex items-center justify-center gap-4 mt-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1"><Check className="size-4 text-primary" /><span>Kredi kartı yok</span></div>
                <div className="flex items-center gap-1"><Check className="size-4 text-primary" /><span>14 gün deneme</span></div>
                <div className="flex items-center gap-1"><Check className="size-4 text-primary" /><span>İstediğin an iptal</span></div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="relative mx-auto max-w-5xl">
              <div className="rounded-xl overflow-hidden shadow-2xl border border-border/40 bg-gradient-to-b from-background to-muted/20">
                <Image src="/influencer.png" width={1280} height={720} alt="fenomen.io AI dashboard" className="w-full h-auto" priority />
                <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10 dark:ring-white/10"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 -z-10 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 blur-3xl opacity-70"></div>
              <div className="absolute -top-6 -left-6 -z-10 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-secondary/30 to-primary/30 blur-3xl opacity-70"></div>
            </motion.div>
          </div>
        </section>

        {/* ÖZELLİKLER */}
        <section id="features" className="w-full py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">Özellikler</Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Hesabını büyüten yapay zekâ modülleri</h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">Fenomen, ham veriyi bugün çekebileceğin pratik içerik aksiyonlarına çevirir ve her ay kendini yeniler.</p>
            </motion.div>

            <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, i) => (
                <motion.div key={i} variants={item}>
                  <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur transition-all hover:shadow-md">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="size-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary mb-4">{feature.icon}</div>
                      <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* NASIL ÇALIŞIR */}
        <section id="how" className="w-full py-20 md:py-32 bg-muted/30 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)]"></div>

          <div className="container px-4 md:px-6 relative">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">Nasıl Çalışır</Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Sürekli öğrenen AI raporlama</h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">Tek seferlik analiz değil — her ay güncellenen, uygulanabilir bir büyüme rehberi.</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative">
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2 z-0"></div>

              {[
                { step: "01", title: "Profilini bağla", description: "TikTok/Instagram @kullanıcı adını veya URL'ni gir." },
                { step: "02", title: "AI modeli seni öğrensin", description: "Fenomen, içerik desenlerini ve etkileşim sinyallerini anlamlandırır." },
                { step: "03", title: "Aylık AI raporunu al", description: "Hook’lar, kısa senaryolar, gönderi takvimi ve büyüme önerileri her ay yenilenir." },
              ].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="relative z-10 flex flex-col items-center text-center space-y-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-xl font-bold shadow-lg">{s.step}</div>
                  <h3 className="text-xl font-bold">{s.title}</h3>
                  <p className="text-muted-foreground">{s.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* SONUÇLAR */}
        <section id="testimonials" className="w-full py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">Sonuçlar</Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Creator’lar yapay zekâ ile daha hızlı büyüyor</h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">Güzellik, moda, yaşam tarzı ve teknoloji dikeylerinden örnekler.</p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                { quote: "AI'nin önerdiği hook’larla izlenme oranımız iki katına çıktı.", author: "Efsun C.", role: "Beauty Creator (29K)", rating: 5 },
                { quote: "Aylık raporlar sayesinde takvimi netleştirdim; 30 günde %38 etkileşim artışı.", author: "Buket Ö.", role: "Lifestyle Creator (45K)", rating: 5 },
                { quote: "Rakip kıyası ve önerilen formatlar ile CPA %24 düştü.", author: "Growth Manager", role: "D2C Skincare", rating: 5 },
                { quote: "Trend + senaryo önerileri üretimi hızlandırdı, performans yükseldi.", author: "David K.", role: "Creator Coach", rating: 5 },
                { quote: "Marka‑güven kontrolleri onay süreçlerini kısalttı.", author: "Lisa P.", role: "Ajans Yöneticisi", rating: 5 },
                { quote: "AI raporu, hedefe giden yolu netleştirdi; tempomu ona göre ayarladım.", author: "James W.", role: "Tech Creator (62K)", rating: 5 },
              ].map((t, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.05 }}>
                  <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur transition-all hover:shadow-md">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex mb-4">{Array(t.rating).fill(0).map((_, j) => (<Star key={j} className="size-4 text-yellow-500 fill-yellow-500" />))}</div>
                      <p className="text-lg mb-6 flex-grow">{t.quote}</p>
                      <div className="flex items-center gap-4 mt-auto pt-4 border-t border-border/40">
                        <div className="size-10 rounded-full bg-muted flex items-center justify-center text-foreground font-medium">{t.author.charAt(0)}</div>
                        <div>
                          <p className="font-medium">{t.author}</p>
                          <p className="text-sm text-muted-foreground">{t.role}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FİYATLANDIRMA */}
        <section id="pricing" className="w-full py-20 md:py-32 bg-muted/30 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)]"></div>

          <div className="container px-4 md:px-6 relative">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">Fiyatlandırma</Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Aylık AI raporlarıyla büyü</h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">Ücretsiz başla. Yapay zekâ ile her ay gelişen rehber için yükselt.</p>
            </motion.div>

            <div className="mx-auto max-w-5xl">
              <Tabs defaultValue="monthly" className="w-full">
                <div className="flex justify-center mb-8">
                  <TabsList className="rounded-full p-1">
                    <TabsTrigger value="monthly" className="rounded-full px-6">Aylık</TabsTrigger>
                    <TabsTrigger value="annually" className="rounded-full px-6">Yıllık (%20 indirim)</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="monthly">
                  <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
                    {[
                      {
                        name: "Ücretsiz Başlangıç",
                        price: "$0",
                        description: "Hızlı puan + 3 AI hook.",
                        features: ["1 profil", "Temel profil skoru", "3 AI hook", "E‑posta özeti"],
                        cta: "Ücretsiz başla",
                      },
                      {
                        name: "AI Pro",
                        price: "$29",
                        description: "Aylık AI raporu ve dinamik içerik planı.",
                        features: ["3 profile kadar", "Hook & senaryo önerileri", "Haftalık görevler ve takvim", "Trend & ses önerileri", "Kıyas & fırsat haritası"],
                        cta: "14 gün denemeyi başlat",
                        popular: true,
                      },
                      {
                        name: "Ajans AI",
                        price: "$99",
                        description: "Sınırsız profil ve beyaz etiket raporlar.",
                        features: ["Sınırsız profil", "Beyaz etiket PDF", "Marka‑güven kontrolleri", "Ekip & yetkiler", "API & dışa aktarım"],
                        cta: "Satışla iletişime geç",
                      },
                    ].map((plan, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                        <Card className={`relative overflow-hidden h-full ${plan.popular ? "border-primary shadow-lg" : "border-border/40 shadow-md"} bg-gradient-to-b from-background to-muted/10 backdrop-blur`}>
                          {plan.popular && (
                            <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-lg">En Popüler</div>
                          )}
                          <CardContent className="p-6 flex flex-col h-full">
                            <h3 className="text-2xl font-bold">{plan.name}</h3>
                            <div className="flex items-baseline mt-4"><span className="text-4xl font-bold">{plan.price}</span><span className="text-muted-foreground ml-1">/ay</span></div>
                            <p className="text-muted-foreground mt-2">{plan.description}</p>
                            <ul className="space-y-3 my-6 flex-grow">{plan.features.map((f, j) => (<li key={j} className="flex items-center"><Check className="mr-2 size-4 text-primary" /><span>{f}</span></li>))}</ul>
                            <Button className={`w-full mt-auto rounded-full ${plan.popular ? "bg-primary hover:bg-primary/90" : "bg-muted hover:bg-muted/80"}`} variant={plan.popular ? "default" : "outline"}>{plan.cta}</Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="annually">
                  <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
                    {[
                      { name: "Ücretsiz Başlangıç", price: "$0", description: "Hızlı puan + 3 AI hook.", features: ["1 profil", "Temel profil skoru", "3 AI hook", "E‑posta özeti"], cta: "Ücretsiz başla" },
                      { name: "AI Pro", price: "$23", description: "Aylık AI raporu ve dinamik içerik planı.", features: ["3 profile kadar", "Hook & senaryo önerileri", "Haftalık görevler ve takvim", "Trend & ses önerileri", "Kıyas & fırsat haritası"], cta: "14 gün denemeyi başlat", popular: true },
                      { name: "Ajans AI", price: "$79", description: "Sınırsız profil ve beyaz etiket raporlar.", features: ["Sınırsız profil", "Beyaz etiket PDF", "Marka‑güven kontrolleri", "Ekip & yetkiler", "API & dışa aktarım"], cta: "Satışla iletişime geç" },
                    ].map((plan, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                        <Card className={`relative overflow-hidden h-full ${plan.popular ? "border-primary shadow-lg" : "border-border/40 shadow-md"} bg-gradient-to-b from-background to-muted/10 backdrop-blur`}>
                          {plan.popular && (<div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-lg">En Popüler</div>)}
                          <CardContent className="p-6 flex flex-col h-full">
                            <h3 className="text-2xl font-bold">{plan.name}</h3>
                            <div className="flex items-baseline mt-4"><span className="text-4xl font-bold">{plan.price}</span><span className="text-muted-foreground ml-1">/ay</span></div>
                            <p className="text-muted-foreground mt-2">{plan.description}</p>
                            <ul className="space-y-3 my-6 flex-grow">{plan.features.map((f, j) => (<li key={j} className="flex items-center"><Check className="mr-2 size-4 text-primary" /><span>{f}</span></li>))}</ul>
                            <Button className={`w-full mt-auto rounded-full ${plan.popular ? "bg-primary hover:bg-primary/90" : "bg-muted hover:bg-muted/80"}`} variant={plan.popular ? "default" : "outline"}>{plan.cta}</Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* SSS */}
        <section id="faq" className="w-full py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">SSS</Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Sıkça sorulan sorular</h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">Fenomen hakkında merak ettiklerine hızlı yanıt.</p>
            </motion.div>

            <div className="mx-auto max-w-3xl">
              <Accordion type="single" collapsible className="w-full">
                {[
                  { question: "Fenomen tam olarak ne yapar?", answer: "Hesabını büyüten bir yapay zekâ aracıdır. İçeriklerini analiz eder, profil skorunu çıkarır, hook ve senaryo önerir, uygulanabilir bir yol haritası üretir ve bunları her ay günceller." },
                  { question: "Tek seferlik mi, abonelik mi?", answer: "İlk kurulumdan sonra aylık AI raporları alırsın. Her ay yeni önerilerle büyümeye devam edersin." },
                  { question: "Hangi platformları destekliyor?", answer: "Bugün TikTok, çok yakında Instagram. Her ikisi için @kullanıcı adı veya URL bağlanabilir." },
                  { question: "Veri güvenliği?", answer: "Yalnızca analiz için gerekli alanları işleriz. Veriler şifrelenir; hesabını istediğin an silebilirsin." },
                  { question: "Ajanslar birden fazla creator ekleyebilir mi?", answer: "Evet. Ajans AI planında sınırsız profil, ekip yetkileri ve PDF/API çıktılarına erişim var." },
                ].map((faq, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: i * 0.05 }}>
                    <AccordionItem value={`item-${i}`} className="border-b border-border/40 py-2">
                      <AccordionTrigger className="text-left font-medium hover:no-underline">{faq.question}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="w-full py-20 md:py-32 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

          <div className="container px-4 md:px-6 relative">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="flex flex-col items-center justify-center space-y-6 text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">Yapay zekâ ile büyümeye hazır mısın?</h2>
              <p className="mx-auto max-w-[700px] text-primary-foreground/80 md:text-xl">Ücretsiz başla; aylık AI raporlarına abone olarak büyümeni hızlandır.</p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Button size="lg" variant="secondary" className="rounded-full h-12 px-8 text-base">Ücretsiz başla<ArrowRight className="ml-2 size-4" /></Button>
                <Button size="lg" variant="outline" className="rounded-full h-12 px-8 text-base bg-transparent border-white text-white hover:bg-white/10">Örnek AI raporu</Button>
              </div>
              <p className="text-sm text-primary-foreground/80 mt-4">Kredi kartı gerekmez • 14 gün deneme • İstediğin an iptal</p>
            </motion.div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="w-full border-t bg-background/95 backdrop-blur-sm">
        <div className="container flex flex-col gap-8 px-4 py-10 md:px-6 lg:py-16">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-bold">
                <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground">F</div>
                <span>fenomen</span>
              </div>
              <p className="text-sm text-muted-foreground">Hesabını büyüten yapay zekâ: analiz, hook, senaryo ve aylık raporlar.</p>
              <div className="flex gap-4">
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg><span className="sr-only">Facebook</span></Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg><span className="sr-only">Twitter</span></Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg><span className="sr-only">LinkedIn</span></Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold">Ürün</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Özellikler</Link></li>
                <li><Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Fiyatlandırma</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Örnek AI raporu</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">API</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold">Kaynaklar</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Dokümanlar</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Rehberler</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Destek</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold">Şirket</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Hakkımızda</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Kariyer</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Gizlilik</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">Kullanım Şartları</Link></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row justify-between items-center border-t border-border/40 pt-8">
            <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} fenomen.io — Tüm hakları saklıdır.</p>
            <div className="flex gap-4">
              <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Gizlilik</Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Şartlar</Link>
              <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Çerez Politikası</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

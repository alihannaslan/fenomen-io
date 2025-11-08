"use client"

import { motion } from "framer-motion"
import { Plus, Minus, Sparkles } from "lucide-react"
import { useState } from "react"

export function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  const faqs = [
    {
      question: "Fenomen nedir ve nasıl çalışır?",
      answer:
        "Fenomen; TikTok ve Instagram profillerini yapay zekâ ile analiz eden, profil skorunu çıkaran ve hesabını büyütmek için gereken adımları otomatik üreten bir araçtır. AI; geçmiş içeriklerinin kalıplarını, nişindeki etkileşim dinamiklerini ve kıyas setlerini inceleyerek hook’lar, senaryo önerileri, haftalık içerik takvimi ve hedef odaklı bir büyüme yol haritası üretir.",
    },
    {
      question: "Bu analiz tek seferlik mi, düzenli rapor alacak mıyım?",
      answer:
        "Analiz tek seferlik değildir. Fenomen; her ay otomatik olarak profilini tekrar değerlendirir, yeni içeriklerinden öğrenir ve **aylık büyüme raporu** sunar. Ayrıca haftalık içerik takvimi ve KPI’lar (izlenme, yorum, kayıt, paylaşım gibi) güncellenir.",
    },
    {
      question: "Hangi platformları destekliyorsunuz?",
      answer:
        "Bugün TikTok destekliyoruz; Instagram da sırada. Profil kullanıcı adını veya profil URL’ini girmen yeterli. Desteklenmeyen platformlar için rapor isteği sıraya alınır ve hazır olduğunda e-posta ile gönderilir.",
    },
    {
      question: "Yapay zekâ hesabımı gerçekten büyütür mü?",
      answer:
        "Fenomen; nişine uygun **ilk 3 saniye hook’ları**, video iskeleti/senaryosu, caption ve CTA önerileri ile **üretim hızını** ve **içerik kalitesini** artırır. Düzenli uygulandığında; izlenme, kaydetme ve yorum metriklerinde yükseliş görülmesi beklenir. Bu bir taahhüt değil; ama çoğu kullanıcı 30–45 gün düzenli uygulamada anlamlı iyileşme görür.",
    },
    {
      question: "Verilerimi nasıl topluyor ve işliyorsunuz? Güvenli mi?",
      answer:
        "Yalnızca analize gerek duyulan açık profil verilerini işleriz; veriler aktarım ve depolamada şifrelenir. Fenomen; hesap şifreni istemez, resmi API ve kamuya açık sinyallerle çalışır. İstediğin zaman verilerini silme talebinde bulunabilirsin.",
    },
    {
      question: "Aylık rapor neleri içerir?",
      answer:
        "Profil skoru (trend ve benchmark karşılaştırması), içerik format/konu önerileri, **hazır hook & senaryo listesi**, haftalık içerik takvimi, metrik özetleri (ER, izlenme/follower oranı, kayıt-paylaşım oranı) ve bir sonraki ay için **net görev listesi**.",
    },
    {
      question: "Ajanslar ve markalar için beyaz etiket rapor var mı?",
      answer:
        "Evet. Ajans planında sınırsız profil, ekip yetkilendirme, PDF/CSV dışa aktarma ve **beyaz etiket** rapor seçenekleri bulunur. Satış ekibimizle görüşerek özelleştirme yapılabilir.",
    },
    {
      question: "Deneme süresi ve iptal koşulları nasıl?",
      answer:
        "Fenomen’i ücretsiz hızlı tarama ile deneyebilirsin. Pro planda 14 günlük deneme var; memnun kalmazsan panelden tek tıkla iptal edebilirsin. Kredi kartı olmadan başlayan seçenekler de mevcuttur.",
    },
    {
      question: "Kendi içerik takvimimi kullanabilir miyim?",
      answer:
        "Evet. Fenomen’in önerdiği takvimi tamamen özelleştirebilir; gün, saat, format ve niş etiketlerini değiştirerek kendi iş akışına entegre edebilirsin.",
    },
    {
      question: "Fenomen raporları ne kadar doğru?",
      answer:
        "Raporlar veri temelli yön gösterir. AI; niş benchmark’ları, içerik formülleri ve geçmiş performans örüntülerine dayanır. **±15% sapma** ile eğilim yakalaması hedeflenir, ancak bu bir yatırım tavsiyesi ya da garanti değildir.",
    },
  ]

  return (
    <section id="faq" className="relative overflow-hidden pt-24 pb-32">
      {/* Arka plan parıltıları */}
      <div className="absolute top-1/2 -right-20 z-[-1] h-64 w-64 rounded-full bg-primary/20 opacity-80 blur-3xl" />
      <div className="absolute top-1/2 -left-20 z-[-1] h-64 w-64 rounded-full bg-primary/20 opacity-80 blur-3xl" />

      <div className="container z-10 mx-auto px-4">
        {/* Üst rozet */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 uppercase text-primary border-primary/40">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm">Sıkça Sorulan Sorular</span>
          </div>
        </motion.div>

        {/* Başlık */}
        <motion.h2
          className="mx-auto mt-6 max-w-2xl text-center text-4xl font-semibold tracking-tight md:text-[54px] md:leading-[60px]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Sorular mı var?{" "}
          <span className="bg-gradient-to-b from-foreground via-rose-200 to-primary bg-clip-text text-transparent">
            Yanıtlar burada.
          </span>
        </motion.h2>

        {/* Liste */}
        <div className="mx-auto mt-12 flex max-w-2xl flex-col gap-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="cursor-pointer rounded-2xl border border-white/10 bg-gradient-to-b from-secondary/40 to-secondary/10 p-6 shadow-[0px_2px_0px_0px_rgba(255,255,255,0.1)_inset] transition-all duration-300 hover:border-white/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleItem(index)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  toggleItem(index)
                }
              }}
              aria-expanded={openItems.includes(index)}
              aria-controls={`faq-panel-${index}`}
            >
              <div className="flex items-start justify-between">
                <h3 className="m-0 pr-4 text-base font-medium sm:text-lg">{faq.question}</h3>
                <motion.div
                  animate={{ rotate: openItems.includes(index) ? 180 : 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="ml-2 shrink-0 rounded-full bg-white/5 p-1"
                  aria-hidden="true"
                >
                  {openItems.includes(index) ? (
                    <Minus className="text-primary h-5 w-5 transition duration-300" />
                  ) : (
                    <Plus className="text-primary h-5 w-5 transition duration-300" />
                  )}
                </motion.div>
              </div>

              {openItems.includes(index) && (
                <motion.div
                  id={`faq-panel-${index}`}
                  className="mt-4 overflow-hidden text-sm leading-relaxed text-muted-foreground sm:text-[15px]"
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut", opacity: { duration: 0.2 } }}
                >
                  {faq.answer}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

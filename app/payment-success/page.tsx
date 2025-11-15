// app/payment-success/page.tsx
export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-8 shadow-xl text-center">
        <h1 className="text-2xl font-bold mb-3">Ödeme Başarılı 🎉</h1>
        <p className="text-slate-300 mb-4">
          TikTok analiz hakkın hesabına tanımlandı. Artık fenomen.io içinde
          analiz başlatabilirsin.
        </p>
      </div>
    </div>
  )
}

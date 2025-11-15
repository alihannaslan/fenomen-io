// app/api/iyzico-checkout/route.ts
import { NextRequest, NextResponse } from "next/server"

/**
 * İyzico entegrasyonu kaldırıldı.
 * Bu endpoint artık sadece demo amaçlı bir response döndürüyor.
 */
export async function POST(req: NextRequest) {
  // İleride farklı bir ödeme altyapısına geçtiğinde burayı güncelleyebilirsin.
  return NextResponse.json({
    ok: true,
    provider: "none",
    message: "Ödeme altyapısı geçici olarak devre dışı.",
    checkoutUrl: null,
  })
}

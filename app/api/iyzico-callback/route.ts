// app/api/iyzico-callback/route.ts
import { NextRequest, NextResponse } from "next/server"
import { iyzipay } from "@/lib/iyzico"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  const url = req.nextUrl
  const userId = url.searchParams.get("userId") || "unknown"
  const packageId = url.searchParams.get("packageId") || "tiktok-single"

  const formData = await req.formData()
  const token = formData.get("token") as string | null

  if (!token) {
    console.error("iyzico-callback: token yok")
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL || ""}/payment-error`,
    )
  }

  return new Promise((resolve) => {
    iyzipay.checkoutForm.retrieve(
      {
        locale: "tr",
        conversationId: `cb_${Date.now()}`,
        token,
      },
      async (err: any, result: any) => {
        if (err) {
          console.error("iyzico callback error:", err)
          resolve(
            NextResponse.redirect(
              `${process.env.NEXT_PUBLIC_BASE_URL || ""}/payment-error`,
            ),
          )
          return
        }

        console.log("iyzico callback result:", result)

        if (result.status === "success") {
          // 🔴 ÖNEMLİ: burada kendi DB'ne yazman gereken yer
          // Örneğin:
          // await db.payment.create({ userId, packageId, iyzicoRaw: result })
          // await db.user.update({ where: { id: userId }, data: { credits: { increment: 1 } } })

          const redirectUrl = `${
            process.env.NEXT_PUBLIC_BASE_URL || ""
          }/payment-success?packageId=${encodeURIComponent(
            packageId,
          )}&userId=${encodeURIComponent(userId)}`

          resolve(NextResponse.redirect(redirectUrl))
        } else {
          console.error("iyzico ödeme başarısız:", result.errorMessage)
          const redirectUrl = `${
            process.env.NEXT_PUBLIC_BASE_URL || ""
          }/payment-error?reason=${encodeURIComponent(
            result.errorMessage || "unknown",
          )}`

          resolve(NextResponse.redirect(redirectUrl))
        }
      },
    )
  })
}

// iyzico callback bazen GET isteği de atabiliyor, garanti olsun diye:
export async function GET() {
  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_BASE_URL || ""}/payment-error`,
  )
}

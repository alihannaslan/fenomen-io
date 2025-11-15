// app/api/iyzico-checkout/route.ts

import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

type CheckoutRequestBody = {
  packageId?: string
  userId?: string
}

export async function POST(req: NextRequest) {
  try {
    // 1) Body
    const body = (await req.json().catch(() => ({}))) as CheckoutRequestBody
    const packageId = body.packageId || "tiktok-single"
    const userId = body.userId || "guest"

    // 2) Paket bilgisi (şimdilik sabit)
    const pkg = {
      id: "PK_TIKTOK_SINGLE",
      name: "Tek Seferlik TikTok Analiz Paketi",
      price: "299.00",
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    if (!baseUrl) {
      return NextResponse.json(
        { ok: false, error: "NEXT_PUBLIC_BASE_URL eksik" },
        { status: 500 },
      )
    }

    const callbackUrl = `${baseUrl}/api/iyzico-callback?userId=${encodeURIComponent(
      userId,
    )}&packageId=${encodeURIComponent(packageId)}`

    // 3) İyzico client'ı burada kur (hata alırsak yakalayabilelim)
    let iyzipay: any
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const Iyzipay = require("iyzipay")
      iyzipay = new Iyzipay({
        apiKey: process.env.IYZICO_API_KEY,
        secretKey: process.env.IYZICO_SECRET_KEY,
        uri:
          process.env.IYZICO_URI || "https://sandbox-api.iyzipay.com",
      })
    } catch (e) {
      console.error("iyzico init error:", e)
      return NextResponse.json(
        { ok: false, error: "iyzico_init_error", detail: String(e) },
        { status: 500 },
      )
    }

    // 4) Test buyer (sonra session'dan doldurursun)
    const buyer = {
      id: userId,
      name: "Test",
      surname: "User",
      gsmNumber: "+905555555555",
      email: "test@example.com",
      identityNumber: "11111111111",
      ip: "85.34.78.112",
      city: "Istanbul",
      country: "Türkiye",
      registrationAddress: "Test mah. No:1",
      zipCode: "34000",
    }

    // 5) İyzico Hosted Checkout isteği
    return new Promise((resolve) => {
      iyzipay.checkoutFormInitialize.create(
        {
          locale: "tr",
          conversationId: `${userId}_${Date.now()}`,
          price: pkg.price,
          paidPrice: pkg.price,
          currency: "TRY",
          installment: 1,
          basketId: pkg.id,
          paymentGroup: "PRODUCT",
          callbackUrl,
          buyer,
          shippingAddress: {
            contactName: `${buyer.name} ${buyer.surname}`,
            city: buyer.city,
            country: buyer.country,
            address: buyer.registrationAddress,
            zipCode: buyer.zipCode,
          },
          billingAddress: {
            contactName: `${buyer.name} ${buyer.surname}`,
            city: buyer.city,
            country: buyer.country,
            address: buyer.registrationAddress,
            zipCode: buyer.zipCode,
          },
          basketItems: [
            {
              id: pkg.id,
              name: pkg.name,
              category1: "Dijital Hizmet",
              category2: "Analiz",
              itemType: "VIRTUAL",
              price: pkg.price,
            },
          ],
        },
        (err: any, result: any) => {
          if (err) {
            console.error("iyzico checkout error:", err)
            resolve(
              NextResponse.json(
                { ok: false, error: "iyzico_error", detail: err },
                { status: 500 },
              ),
            )
            return
          }

          console.log("iyzico response:", result)

          if (result?.paymentPageUrl) {
            resolve(
              NextResponse.json(
                { ok: true, url: result.paymentPageUrl },
                { status: 200 },
              ),
            )
          } else {
            resolve(
              NextResponse.json(
                {
                  ok: false,
                  error: "no_payment_page_url",
                  result,
                },
                { status: 500 },
              ),
            )
          }
        },
      )
    })
  } catch (e: any) {
    console.error("checkout server error:", e)
    return NextResponse.json(
      { ok: false, error: "server_error", detail: e?.message },
      { status: 500 },
    )
  }
}

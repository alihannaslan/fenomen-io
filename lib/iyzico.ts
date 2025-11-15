// lib/iyzico.ts

// iyzipay TypeScript'te tip içermediği için require kullanıyoruz
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Iyzipay = require("iyzipay")

if (!process.env.IYZICO_API_KEY || !process.env.IYZICO_SECRET_KEY || !process.env.IYZICO_URI) {
  throw new Error("IYZICO env değişkenleri eksik. .env.local dosyanı kontrol et.")
}

export const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY,
  secretKey: process.env.IYZICO_SECRET_KEY,
  uri: process.env.IYZICO_URI,
})

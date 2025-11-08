"use client"

export function NewReleasePromo() {
  return (
    <section className="mt-12 w-full">
      <div className="mx-auto max-w-4xl rounded-[40px] border border-black/5 dark:border-white/20 p-2 shadow-sm">
        <div className="relative mx-auto h-[400px] max-w-4xl overflow-hidden rounded-[38px] border border-black/5 dark:border-white/20 bg-primary p-2 shadow-sm">
          {/* Subtle radial glow from center */}
          <div
            className="absolute inset-0 z-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(231,138,83,0.18), transparent 70%)",
            }}
          />

          {/* Film grain overlay */}
          <div
            className="absolute inset-0 z-0 opacity-[0.02]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />

          <div className="relative z-10">
            <div className="mt-8 text-center">
              <h2 className="text-4xl font-bold text-white mb-6">
                Yapay zekâ ile hesabını büyüt.
              </h2>
              <p className="text-white/80 mb-8">
                Fenomen; profilini analiz eder, aylık otomatik rapor üretir, hazır
                <span className="font-semibold"> hook</span> ve senaryolarla
                içerik takvimi çıkarır. Başla, ölçekle, tekrarla.
              </p>

              {/* Minimal mark icon */}
              <svg
                width="100"
                height="50"
                viewBox="0 0 100 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="fill-black dark:fill-white mx-auto mb-4"
                aria-hidden="true"
              >
                <path d="M68.7 5.4c-1.36 7.3-.16 14.7-.17 22.03 0 2.08-.11 4.15-.4 6.23-.13.91 1.3 1.07 1.43.16.99-7.34-.32-14.74-.11-22.11.06-2.07.26-4.13.63-6.17.07-.37-.26-.75-.63-.79-.37-.04-.69.24-.75.65z"></path>
                <path d="M74.01 26.13c-.75.99-1.46 1.98-1.99 3.1-.46.94-.82 1.91-1.3 2.86-.22.44-.46.85-.76 1.22-.13.16-.27.34-.43.49-.06.05-.6.43-.6.46 0-.08.15.13.09 0-.05-.1-.15-.2-.2-.29-.17-.28-.34-.55-.53-.85l-1.1-1.77c-.81-1.3-1.64-2.63-2.43-3.93-.19-.33-.73-.33-.99-.12-.32.26-.31.7-.11 1.02.78 1.27 1.58 2.55 2.36 3.82l1.17 1.86c.34.52.66 1.27 1.26 1.55 1.19.54 2.35-.86 2.91-1.73.66-.99 1.07-2.04 1.56-3.1.58-1.32 1.37-2.47 2.22-3.6.56-.74-.58-1.59-1.13-.81zM55.13 12.28c-.44 5.99-.47 12.02-.1 17.99.1 1.69.22 3.4.4 5.09.1.91 1.52.69 1.41-.38-.59-5.87-.77-11.78-.58-17.67.07-1.67.14-3.37.27-4.99.08-.94-1.35-1.1-1.4-.04z"></path>
              </svg>

              {/* CTA */}
              <div className="flex items-center justify-center gap-3">
                <a href="/signup">
                  <div className="group border-border bg-secondary/70 flex h-[64px] cursor-pointer items-center gap-2 rounded-full border p-[11px] mt-6">
                    <div className="border-border bg-primary flex h-[43px] items-center justify-center rounded-full border">
                      <p className="mr-3 ml-2 flex items-center justify-center gap-2 font-medium tracking-tight text-white">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-globe animate-spin"
                          aria-hidden="true"
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
                          <path d="M2 12h20"></path>
                        </svg>
                        Ücretsiz Başla
                      </p>
                    </div>
                    <div className="border-border flex size-[26px] items-center justify-center rounded-full border-2 transition-all ease-in-out group-hover:ml-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-arrow-right transition-all ease-in-out group-hover:rotate-45"
                        aria-hidden="true"
                      >
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </div>
                  </div>
                </a>

                <a
                  href="/pricing"
                  className="mt-6 inline-flex h-[64px] items-center rounded-full border border-white/30 px-6 text-white/90 hover:bg-white/10 transition-colors"
                >
                  Planları Gör
                </a>
              </div>
            </div>

            {/* Stroked text wordmark */}
            <h1
              className="absolute inset-x-0 mt-[120px] text-center text-[100px] font-semibold text-transparent sm:mt-[30px] sm:text-[190px] pointer-events-none"
              style={{ WebkitTextStroke: "1px currentColor", color: "transparent" }}
              aria-hidden="true"
            >
              fenomen
            </h1>
            <h1
              className="absolute inset-x-0 mt-[120px] text-center text-[100px] font-semibold text-white sm:mt-[30px] sm:text-[190px] pointer-events-none"
              aria-hidden="true"
            >
              fenomen
            </h1>
          </div>
        </div>
      </div>
    </section>
  )
}

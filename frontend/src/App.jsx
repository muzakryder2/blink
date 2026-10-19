import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function Icon({ name, className = "size-5" }) {
  const paths = {
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    bolt: <path d="m13 2-9 12h7l-1 8 10-13h-7V2Z" />,
    chart: (
      <>
        <path d="M4 19V9m6 10V5m6 14v-7m4 7H2" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    copy: (
      <>
        <rect width="13" height="13" x="9" y="9" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </>
    ),
    cursor: <path d="m3 3 7.5 18 2.6-7.9L21 10.5 3 3Z" />,
    link: (
      <>
        <path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1" />
        <path d="M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.1-1.1" />
      </>
    ),
    menu: (
      <>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </>
    ),
    qr: (
      <>
        <rect width="5" height="5" x="3" y="3" rx=".5" />
        <rect width="5" height="5" x="16" y="3" rx=".5" />
        <rect width="5" height="5" x="3" y="16" rx=".5" />
        <path d="M16 16h2v2h-2zm4 4h1m-5 1h1m4-5v1" />
      </>
    ),
    shield: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  };

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function Button({
  children,
  variant = "primary",
  type = "button",
  onClick,
  className = "",
}) {
  const styles = {
    primary:
      "bg-emerald-400 text-neutral-950 shadow-[0_12px_30px_rgba(52,211,153,.2)] hover:bg-emerald-300",
    secondary: "border border-white/12 bg-white/7 text-white hover:bg-white/12",
    ghost: "text-neutral-300 hover:bg-white/7 hover:text-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

function Brand() {
  return (
    <a
      href="#"
      className="flex items-center gap-2.5 text-white"
      aria-label="Blink homepage"
    >
      <span className="grid size-8 place-items-center rounded-[10px] bg-emerald-400 text-neutral-950">
        <Icon name="bolt" className="size-4.25 fill-current" />
      </span>
      <span className="text-lg font-bold tracking-tight">blink</span>
    </a>
  );
}

function FeatureCard({ icon, title, description, children, className = "" }) {
  return (
    <article
      className={`group overflow-hidden rounded-3xl border border-white/9 bg-white/[.035] p-6 transition-colors hover:border-emerald-300/25 hover:bg-white/5 ${className}`}
    >
      <div className="mb-8 grid size-11 place-items-center rounded-2xl border border-white/10 bg-white/7 text-emerald-300">
        <Icon name={icon} />
      </div>
      <h3 className="text-xl font-semibold tracking-tight text-white">
        {title}
      </h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-neutral-400">
        {description}
      </p>
      {children}
    </article>
  );
}

export const App = () => {
  const [history, setHistory] = useState([]);
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const BASE_URL = "/api";

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`${BASE_URL}/history`);
        const data = await response.json();
        setHistory(data.data);
      } catch (error) {
        console.error("Error fetching link history:", error);
        setHistory([]);
      }
    };
    fetchHistory();
  }, []);

  const shorten = async (event) => {
    event.preventDefault();
    try {
      if (!url.trim()) return;
      if (
        !url.trim().startsWith("http://") &&
        !url.trim().startsWith("https://")
      ) {
        toast.error('URL must start with either "http://" or "https://"');
        return;
      }

      const res = await fetch(`${BASE_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullURL: url }),
      });
      const data = await res.json();
      setShortUrl(`${data.data.shortURL}`);
    } catch (err) {
      console.log("Error creating short URL", err.message);
    }
    setCopied(false);
  };

  const copyLink = async () => {
    if (!shortUrl) return;
    await navigator.clipboard?.writeText(
      `${window.location.origin}/${shortUrl}`,
    );
    setCopied(true);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#080a09] text-neutral-100 selection:bg-emerald-300 selection:text-neutral-950">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-180 bg-[radial-gradient(circle_at_50%_-10%,rgba(52,211,153,.14),transparent_52%)]" />

      <header className="relative z-20 mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Brand />
        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Primary navigation"
        >
          {["Product", "Solutions", "Pricing", "Resources"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-400 transition-colors hover:text-white"
            >
              {item}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-2 sm:flex">
          <Button variant="ghost">Log in</Button>
          <Button>Start for free</Button>
        </div>
        <button
          className="grid size-10 place-items-center rounded-xl border border-white/10 text-neutral-300 sm:hidden"
          aria-label="Open menu"
        >
          <Icon name="menu" />
        </button>
      </header>

      <main className="relative z-10">
        <section className="mx-auto max-w-6xl px-5 pb-20 pt-20 text-center sm:pt-28 lg:px-8 lg:pb-28">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/8 px-3 py-1.5 text-xs font-medium text-emerald-200">
            <span className="size-1.5 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,.8)]" />
            Now with real-time conversion analytics
            <Icon name="arrow" className="size-3.5" />
          </div>

          <h1 className="mx-auto mt-7 max-w-4xl text-balance text-5xl font-semibold leading-[.98] tracking-[-.055em] text-white sm:text-6xl lg:text-8xl">
            Short links.
            <span className="block text-neutral-500">Long-lasting impact.</span>
          </h1>
          <p className="mx-auto mt-7 max-w-2xl text-balance text-base leading-7 text-neutral-400 sm:text-lg">
            Create memorable links, track every click, and understand what makes
            your audience move—all in one beautifully simple workspace.
          </p>

          <form
            onSubmit={shorten}
            className="mx-auto mt-10 max-w-3xl rounded-2xl border border-white/12 bg-white/[.07] p-2 shadow-2xl shadow-black/30 backdrop-blur-xl sm:flex"
          >
            <label className="flex min-w-0 flex-1 items-center gap-3 px-3">
              <Icon name="link" className="size-5 shrink-0 text-neutral-500" />
              <span className="sr-only">Paste a long URL</span>
              <input
                type="text"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder="Paste your long link here"
                className="h-12 w-full bg-transparent text-sm text-white outline-none placeholder:text-neutral-500"
                required
              />
            </label>
            <Button type="submit" className="w-full sm:w-auto">
              Shorten link <Icon name="arrow" className="size-4" />
            </Button>
          </form>

          {shortUrl && (
            <div className="mx-auto mt-3 flex max-w-3xl items-center justify-between rounded-xl border border-emerald-300/20 bg-emerald-300/7 px-4 py-3 text-left">
              <div>
                <p className="text-xs text-neutral-500">
                  Your short link is ready
                </p>
                <p className="mt-0.5 text-sm font-medium text-emerald-300">
                  {shortUrl}
                </p>
              </div>
              <Button variant="ghost" onClick={copyLink} className="px-3">
                <Icon name={copied ? "check" : "copy"} className="size-4" />
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          )}

          <p className="mt-4 text-xs text-neutral-600">
            No credit card required · 10 links free every month
          </p>
        </section>

        <section className="mx-auto max-w-6xl px-5 pb-24 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-[.18em] text-neutral-600">
            Link History
          </p>
          {history.length > 0 ? (
            <div className="mt-8 text-neutral-500 sm:grid-cols-4">
              <table className="w-full table-fixed border-collapse">
                <thead>
                  <tr>
                    <th className="text-center p-2 border border-emerald-300 text-white">
                      Full URL
                    </th>
                    <th className="text-center p-2 border border-emerald-300 text-white">
                      Short URL
                    </th>
                    <th className="text-center p-2 border border-emerald-300 text-white">
                      Clicks
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, index) => (
                    <tr key={index}>
                      <td className="text-white text-left p-2 border border-emerald-300">
                        {item.fullURL}
                      </td>
                      <td className="text-left p-2 border border-emerald-300">
                        <a
                          href={`${window.location.origin}/${item.shortURL}`}
                          target="_blank"
                          className="underline text-emerald-300"
                        >
                          {window.location.origin}/{item.shortURL}
                        </a>
                      </td>
                      <td className="text-center p-2 border text-white border-emerald-300">
                        {item.clicks}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-8 flex items-center justify-center text-neutral-500 sm:grid-cols-4">
              <h3 className="text-xl">
                Enter your first URL to see your history
              </h3>
            </div>
          )}
        </section>

        <section id="product" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold text-emerald-300">
              Everything you need to grow
            </p>
            <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-.035em] text-white sm:text-5xl">
              One short link. A complete picture.
            </h2>
            <p className="mt-5 text-base leading-7 text-neutral-400">
              Go beyond the click with tools built to help modern teams share,
              learn, and optimize faster.
            </p>
          </div>

          <div className="mt-14 grid gap-4 lg:grid-cols-2">
            <FeatureCard
              icon="chart"
              title="Analytics that tell the whole story"
              description="See where every click comes from, what converts, and when your audience is most engaged."
              className="min-h-107.5"
            >
              <div className="mt-10 rounded-2xl border border-white/10 bg-[#0b0e0d] p-5">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-neutral-500">Total clicks</p>
                    <p className="mt-1 text-3xl font-semibold text-white">
                      28,492
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-300/10 px-2 py-1 text-xs font-medium text-emerald-300">
                    +24.8%
                  </span>
                </div>
                <div className="mt-8 flex h-28 items-end gap-2">
                  {[30, 48, 38, 70, 55, 88, 64, 96, 78, 100, 82, 94].map(
                    (height, index) => (
                      <span
                        key={index}
                        className="flex-1 rounded-t bg-emerald-300/20 transition-colors group-hover:bg-emerald-300/35"
                        style={{ height: `${height}%` }}
                      />
                    ),
                  )}
                </div>
              </div>
            </FeatureCard>

            <div className="grid gap-4 sm:grid-cols-2">
              <FeatureCard
                icon="qr"
                title="QR codes"
                description="Create custom, trackable QR codes for every campaign."
              />
              <FeatureCard
                icon="shield"
                title="Built for trust"
                description="Branded domains and enterprise-grade link protection."
              />
              <FeatureCard
                icon="cursor"
                title="Smart targeting"
                description="Route visitors by location, device, language, and more."
              />
              <FeatureCard
                icon="bolt"
                title="Lightning fast"
                description="Global delivery keeps every redirect fast and reliable."
              />
            </div>
          </div>
        </section>

        <section id="pricing" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="relative overflow-hidden rounded-4xl border border-emerald-300/20 bg-emerald-300 px-6 py-16 text-center text-neutral-950 sm:px-12 sm:py-20">
            <div className="pointer-events-none absolute -right-24 -top-36 size-80 rounded-full border-60 border-white/20" />
            <div className="pointer-events-none absolute -bottom-36 -left-24 size-80 rounded-full border-60 border-neutral-950/5" />
            <div className="relative">
              <p className="text-sm font-semibold">
                Start creating better links today
              </p>
              <h2 className="mx-auto mt-4 max-w-2xl text-balance text-4xl font-semibold tracking-[-.045em] sm:text-6xl">
                Make every click count.
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-neutral-800 sm:text-base">
                Join more than 12,000 teams using Blink to turn simple links
                into measurable growth.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button className="bg-neutral-950 text-white shadow-xl hover:bg-neutral-800">
                  Start for free <Icon name="arrow" className="size-4" />
                </Button>
                <Button className="border border-neutral-950/15 bg-transparent text-neutral-950 shadow-none hover:bg-white/25">
                  Talk to sales
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 border-t border-white/8 px-5 py-10 sm:flex-row lg:px-8">
        <Brand />
        <p className="text-xs text-neutral-600">
          © {new Date().getFullYear()} Blink, Inc. All rights reserved.
        </p>
        <div className="flex gap-5">
          {["Privacy", "Terms", "Status"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-xs text-neutral-500 hover:text-white"
            >
              {item}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
};

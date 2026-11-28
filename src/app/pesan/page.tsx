"use client";

// /pesan — order picker. Options and prices live in ./order.ts.

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  COLORS, DEFAULT_ORDER, FRAMES, FRAME_COLORS, PRODUCTS, SHAPES, SHAPES_FOR, SIZES,
  examples, hasFrame, ids, matches, quote, rupiah, shapeOf, waLink,
  type Order, type Photo, type ShapeId, type SizeId,
} from "./order";

export default function PesanPage() {
  const [order, setOrder] = useState<Order>(DEFAULT_ORDER);
  const pick = <K extends keyof Order>(k: K) => (v: Order[K]) => setOrder((o) => ({ ...o, [k]: v }));
  const [tapped, setTapped] = useState<Photo | null>(null);
  const from = tapped && matches(tapped, order) ? tapped : null; // dropped once the customer changes one of its picks
  const q = quote(order);
  const isCard = order.product === "ganci";
  const link = waLink(order, from);
  const shape = shapeOf(order);
  let step = 0;

  return (
    <main className="min-h-screen bg-cream pb-28 lg:pb-0">
      <header className="mx-auto max-w-6xl px-6 py-6">
        <Link href="/" className="text-sm font-medium text-bark-light transition-colors hover:text-pine">
          ← Kembali
        </Link>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-pine">Pesan souvenir</p>
        <h1 className="mb-4 font-heading text-4xl text-bark sm:text-5xl">Rakit souvenir rute kamu.</h1>
        <p className="mb-12 max-w-xl leading-relaxed text-bark-light">
          Pilih produk, bentuk, ukuran, dan warna. Rutenya kirim lewat WhatsApp, kami kirim preview 3D dulu sebelum cetak.
        </p>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_400px]">
          {/* Phone: `contents` lets the sketch sit above the options and the summary below them. */}
          <aside className="contents lg:sticky lg:top-8 lg:col-start-2 lg:row-start-1 lg:block lg:space-y-4 lg:self-start">
            <div className="order-1 overflow-hidden rounded-2xl border border-sand/60 bg-cream-dark">
              <Preview order={order} />
              <Examples
                photos={examples(order)}
                chosen={from}
                onPick={(p) => { setOrder((o) => ({ ...o, ...p.pick })); setTapped(p); }}
              />
            </div>
            <div className="order-3 rounded-2xl border border-sand/60 bg-warm-white p-6">
              <ul className="space-y-2 text-sm">
                {q.lines.map((l) => (
                  <li key={l.label} className="flex justify-between gap-4">
                    <span className="text-bark-light">{l.label}</span>
                    <span className="shrink-0 font-medium text-bark">{l.amount === null ? "via chat" : rupiah(l.amount)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-baseline justify-between border-t border-sand/60 pt-4">
                <span className="text-sm font-medium uppercase tracking-wider text-bark-light">Estimasi</span>
                <span className="font-heading text-2xl text-bark">
                  {rupiah(q.total)}
                  {q.pending && <span className="text-sm text-bark-light"> + frame</span>}
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-bark-light/70">
                {q.pending && "Harga frame dikonfirmasi di chat. "}Harga akhir tergantung rute, kami konfirmasi dulu sebelum cetak.
              </p>
              <p className="mt-3 rounded-xl bg-pine/10 px-4 py-3 text-sm text-bark">
                Pesan banyak, misalnya buat komunitas atau event? Ada harga spesial, tanya aja di chat.
              </p>
              <WaButton href={link} className="mt-6 hidden w-full justify-center lg:inline-flex">
                Pesan via WhatsApp
              </WaButton>
              <p className="mt-3 hidden text-center text-xs text-bark-light/70 lg:block">
                Kirim file GPX atau link Strava di chat.
              </p>
            </div>
          </aside>

          <div className="order-2 space-y-12 lg:col-start-1 lg:row-start-1">
            <Step n={++step} title="Produk">
              <div className="grid gap-3 sm:grid-cols-2">
                {ids.products.map((id) => {
                  const p = PRODUCTS[id];
                  const from = typeof p.price === "number" ? p.price : p.price.S;
                  return (
                    <Choice key={id} name="product" value={id} checked={order.product === id} onPick={pick("product")} className="p-5">
                      <span className="block font-heading text-lg text-bark">{p.name}</span>
                      <span className="block text-sm text-bark-light">{p.desc}</span>
                      <span className="mt-1 block text-xs text-bark-light/70">{p.note}</span>
                      <span className="mt-4 block text-xs uppercase tracking-wider text-bark-light/70">
                        {typeof p.price === "number" ? "Harga" : "Mulai dari"}
                      </span>
                      <span className="block font-medium text-pine">{rupiah(from)}</span>
                    </Choice>
                  );
                })}
              </div>
            </Step>

            {shape && SHAPES_FOR[order.product].length > 1 && (
              <Step n={++step} title="Bentuk" hint={SHAPES[shape]}>
                <div className="grid grid-cols-4 gap-3 sm:grid-cols-7">
                  {SHAPES_FOR[order.product].map((id) => (
                    <Choice key={id} name="shape" value={id} checked={shape === id} onPick={pick("shape")} className="flex flex-col items-center gap-2 p-3">
                      <svg viewBox="0 0 40 40" className="h-9 w-9 text-bark" aria-hidden="true">
                        <path d={shapePath(id, 20, 20, 30)} fill="currentColor" />
                      </svg>
                      <span className="text-center text-[11px] leading-tight text-bark-light">{SHAPES[id]}</span>
                    </Choice>
                  ))}
                </div>
              </Step>
            )}

            {!isCard && (
              <Step n={++step} title="Ukuran">
                <div className="grid grid-cols-3 gap-3">
                  {ids.sizes.map((id) => {
                    const price = PRODUCTS[order.product].price;
                    return (
                      <Choice key={id} name="size" value={id} checked={order.size === id} onPick={pick("size")} className="p-4 text-center">
                        <span className="block font-heading text-2xl text-bark">{id}</span>
                        <span className="block text-sm text-bark-light">{SIZES[id]}</span>
                        <span className="mt-2 block text-sm font-medium text-pine">
                          {typeof price === "number" ? "" : rupiah(price[id])}
                        </span>
                      </Choice>
                    );
                  })}
                </div>
              </Step>
            )}

            <Step n={++step} title="Warna" hint="11 warna, pilih base dan garis rutenya.">
              <div className="space-y-6">
                <SwatchRow label="Base" name="base" value={order.base} onPick={pick("base")} />
                <SwatchRow label="Rute" name="route" value={order.route} onPick={pick("route")} />
                {order.base === order.route && (
                  <p className="rounded-xl bg-clay/15 px-4 py-3 text-sm text-bark">
                    Warna rute sama dengan base, garis rutenya nggak akan kelihatan.
                  </p>
                )}
              </div>
            </Step>

            {!isCard && (
              <Step n={++step} title="Frame" hint="Siap gantung di dinding. Frame + foto: rute dan foto kamu dalam satu bingkai.">
                <div className="grid gap-3 sm:grid-cols-3">
                  {ids.frames.map((id) => {
                    const f = FRAMES[id];
                    return (
                      <Choice key={id} name="frame" value={id} checked={order.frame === id} onPick={pick("frame")} className="p-4">
                        <span className="block font-medium text-bark">{f.name}</span>
                        <span className="block text-sm text-pine">
                          {f.price === null ? "harga via chat" : f.price === 0 ? "—" : `+${rupiah(f.price)}`}
                        </span>
                      </Choice>
                    );
                  })}
                </div>
                {order.frame !== "none" && (
                  <div className="mt-6">
                    <p className="mb-3 text-sm text-bark-light">
                      Warna frame · <span className="font-medium text-bark">{FRAME_COLORS[order.frameColor].name}</span>
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {ids.frameColors.map((id) => (
                        <Swatch key={id} name="frameColor" value={id} hex={FRAME_COLORS[id].hex} label={FRAME_COLORS[id].name} checked={order.frameColor === id} onPick={pick("frameColor")} square />
                      ))}
                    </div>
                    {order.frame === "frame_photo" && (
                      <p className="mt-4 text-sm text-bark-light">Fotonya kirim lewat chat bareng rutenya ya.</p>
                    )}
                  </div>
                )}
              </Step>
            )}
          </div>
        </div>
      </section>

      {/* Phone: total and order button stay on screen while scrolling through the options. */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-sand/60 bg-warm-white/95 px-6 py-3 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div>
            <span className="block text-xs uppercase tracking-wider text-bark-light/70">Estimasi</span>
            <span className="font-heading text-lg text-bark">
              {rupiah(q.total)}
              {q.pending && <span className="text-xs text-bark-light"> + frame</span>}
            </span>
          </div>
          <WaButton href={link}>Pesan</WaButton>
        </div>
      </div>
    </main>
  );
}

/* ---------- form pieces ---------- */

function Step({ n, title, hint, children }: { n: number; title: string; hint?: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-1 flex items-baseline gap-3">
        <span className="font-mono text-xs text-pine">{String(n).padStart(2, "0")}</span>
        <span className="font-heading text-xl text-bark">{title}</span>
      </legend>
      {hint ? <p className="mb-4 text-sm text-bark-light/70">{hint}</p> : <div className="mb-4" />}
      {children}
    </fieldset>
  );
}

// A native radio inside a styled label: keyboard and screen-reader support come free.
function Choice<T extends string>({ name, value, checked, onPick, className = "", children }: {
  name: string; value: T; checked: boolean; onPick: (v: T) => void; className?: string; children: React.ReactNode;
}) {
  return (
    <label className={`block cursor-pointer rounded-2xl border border-sand/60 bg-warm-white transition-all hover:border-pine/40 hover:shadow-lg hover:shadow-bark/[0.04] has-[:checked]:border-pine has-[:checked]:ring-1 has-[:checked]:ring-pine has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-pine ${className}`}>
      <input type="radio" name={name} value={value} checked={checked} onChange={() => onPick(value)} className="sr-only" />
      {children}
    </label>
  );
}

function Swatch<T extends string>({ name, value, hex, label, checked, onPick, square = false }: {
  name: string; value: T; hex: string; label: string; checked: boolean; onPick: (v: T) => void; square?: boolean;
}) {
  return (
    <label title={label} className="cursor-pointer rounded-full has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-pine">
      <input type="radio" name={name} value={value} checked={checked} onChange={() => onPick(value)} className="sr-only" />
      <span className="sr-only">{label}</span>
      <span
        aria-hidden="true"
        className={`block border border-bark/10 shadow-sm transition-transform hover:-translate-y-0.5 ${square ? "h-11 w-11 rounded-lg" : "h-9 w-9 rounded-full"} ${checked ? "ring-2 ring-pine ring-offset-2 ring-offset-cream" : ""}`}
        style={{ backgroundColor: hex }}
      />
    </label>
  );
}

function SwatchRow({ label, name, value, onPick }: { label: string; name: string; value: Order["base"]; onPick: (v: Order["base"]) => void }) {
  return (
    <div>
      <p className="mb-3 text-sm text-bark-light">
        {label} · <span className="font-medium text-bark">{COLORS[value].name}</span>
      </p>
      <div className="flex flex-wrap gap-3">
        {ids.colors.map((id) => (
          <Swatch key={id} name={name} value={id} hex={COLORS[id].hex} label={COLORS[id].name} checked={value === id} onPick={onPick} />
        ))}
      </div>
    </div>
  );
}

function WaButton({ href, className = "", children }: { href: string; className?: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2.5 rounded-full bg-pine px-6 py-3 font-medium text-warm-white transition-all hover:bg-pine-dark hover:shadow-xl hover:shadow-pine/20 active:scale-[0.97] ${className}`}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
        <path d={WA_ICON} />
      </svg>
      {children}
    </a>
  );
}

/* ---------- preview sketch ---------- */

const SIZE_CM: Record<SizeId, number> = { S: 10, M: 12, L: 15 };
const MAT = "#FBF8F2";

// A made-up GPS route in a 0..1 box, drawn on every preview.
const ROUTE: [number, number][] = [
  [0.06, 0.8], [0.14, 0.7], [0.12, 0.58], [0.22, 0.5], [0.2, 0.38], [0.32, 0.3], [0.4, 0.36],
  [0.47, 0.24], [0.58, 0.2], [0.63, 0.1], [0.76, 0.14], [0.86, 0.26], [0.8, 0.4], [0.9, 0.52],
  [0.94, 0.66], [0.82, 0.74], [0.7, 0.68], [0.6, 0.8], [0.48, 0.76], [0.4, 0.9],
];

function Preview({ order }: { order: Order }) {
  const { base, route } = order;
  const framed = hasFrame(order);
  const withPhoto = framed && order.frame === "frame_photo";
  const frameHex = FRAME_COLORS[order.frameColor].hex;
  const pieceSize = order.product === "ganci" ? 290 : framed ? (withPhoto ? 128 : 160) : 300 * (SIZE_CM[order.size] / 15);
  const cx = withPhoto ? 128 : 200;

  return (
    <figure>
      {/* Desktop: shrinks on short screens so the sticky column, WhatsApp button included, still fits. */}
      <svg viewBox="0 0 400 400" className="block w-full lg:max-h-[clamp(240px,calc(100vh-570px),400px)] [&_*]:transition-colors [&_*]:duration-300" role="img" aria-label="Sketsa pesanan kamu">
        <defs>
          <filter id="pesan-shadow" x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow dx="0" dy="8" stdDeviation="9" floodColor="#2c2420" floodOpacity="0.18" />
          </filter>
        </defs>
        {framed && (withPhoto ? <FrameBox x={24} y={86} w={352} h={228} hex={frameHex} /> : <FrameBox x={70} y={70} w={260} h={260} hex={frameHex} />)}
        {withPhoto && <PhotoSlot x={230} y={124} w={118} h={152} />}
        <Piece order={order} base={COLORS[base].hex} route={COLORS[route].hex} cx={cx} cy={200} size={pieceSize} />
      </svg>
      <figcaption className="border-t border-sand/60 bg-warm-white px-5 py-3 text-xs text-bark-light/70">
        Sketsa, bukan hasil akhir. Preview 3D dari rute asli kamu kami kirim di chat.
      </figcaption>
    </figure>
  );
}

// Real photos under the sketch. Tapping one sets the picks to that piece (`pick` in order.ts).
function Examples({ photos, chosen, onPick }: { photos: Photo[]; chosen: Photo | null; onPick: (p: Photo) => void }) {
  if (!photos.length) return null;
  return (
    <div className="border-t border-sand/60 bg-warm-white px-5 py-3">
      <p className="mb-2 text-xs text-bark-light/70">
        <span className="font-medium uppercase tracking-wider text-bark-light">{photos.some((p) => p.ai) ? "Contoh" : "Contoh hasil asli"}</span> · ketuk foto untuk pilih yang sama
      </p>
      <ul className="grid grid-cols-3 gap-2">
        {photos.map((p) => (
          <li key={p.src}>
            <button
              type="button"
              onClick={() => onPick(p)}
              aria-pressed={p.src === chosen?.src}
              className={`relative block aspect-[4/3] w-full overflow-hidden rounded-lg bg-cream-dark ring-pine ring-offset-2 ring-offset-warm-white ${p.src === chosen?.src ? "ring-2" : ""}`}
            >
              <Image src={p.src} alt={p.alt} fill sizes="(min-width: 1024px) 120px, 33vw" className="object-cover transition-transform duration-300 hover:scale-105" />
              {p.ai && <span className="absolute left-1.5 top-1.5 rounded-full bg-bark/75 px-2 py-0.5 text-[10px] font-medium text-warm-white">ilustrasi</span>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Piece({ order, base, route, cx, cy, size }: { order: Order; base: string; route: string; cx: number; cy: number; size: number }) {
  const isCard = order.product === "ganci";
  const shape: ShapeId = shapeOf(order) ?? "rect";
  const w = size;
  const h = isCard ? size * (54 / 85) : size;
  const d = isCard ? rectPath(cx - w / 2, cy - h / 2, w, h, w * 0.06) : shapePath(shape, cx, cy, size);
  const thick = Math.max(4, size * 0.035);
  // route box: smaller inside a triangle, and nudged down to its wider half
  const box = shape === "triangle" && !isCard ? size * 0.42 : isCard ? h * 0.62 : size * 0.6;
  const rx = isCard ? cx + w * 0.05 - box * 0.7 : cx - box / 2; // card: route nudged right, clear of the hole
  const ry = cy - box / 2 + (shape === "triangle" && !isCard ? size * 0.12 : 0);
  const routePts = ROUTE.map(([x, y]) => `${(rx + x * box * (isCard ? 1.3 : 1)).toFixed(1)},${(ry + y * box).toFixed(1)}`).join(" ");
  const [sx, sy] = routePts.split(" ")[0].split(",").map(Number);
  const [fx, fy] = routePts.split(" ").at(-1)!.split(",").map(Number);
  const lineW = Math.max(2.5, size * 0.022);
  const clip = `pesan-clip-${order.product}`;

  return (
    <g>
      <defs>
        <clipPath id={clip}><path d={d} /></clipPath>
      </defs>
      <g filter="url(#pesan-shadow)">
        <path d={d} transform={`translate(0 ${thick})`} fill={mix(base, "#000000", 0.32)} />
        <path d={d} fill={base} stroke="rgba(0,0,0,0.08)" />
      </g>
      <g clipPath={`url(#${clip})`}>
        {order.product === "terrain" && <Contours cx={cx} cy={cy} size={size} base={base} />}
        {order.product === "plakat" && <Streets cx={cx} cy={cy} size={size} base={base} />}
        {order.product === "puzzle" && <Jigsaw cx={cx} cy={cy} size={size} base={base} />}
        {/* keychain hole: top left, as on the real cards (F13) */}
        {isCard && <circle cx={cx - w / 2 + w * 0.09} cy={cy - h / 2 + w * 0.09} r={w * 0.035} fill={mix(base, "#000000", 0.35)} />}
        <polyline points={routePts} fill="none" stroke={route} strokeWidth={lineW} strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={sx} cy={sy} r={lineW * 1.4} fill={route} />
        <circle cx={fx} cy={fy} r={lineW * 1.4} fill="none" stroke={route} strokeWidth={lineW * 0.7} />
      </g>
    </g>
  );
}

function Contours({ cx, cy, size, base }: { cx: number; cy: number; size: number; base: string }) {
  // terrain: nested blobs, each a little lighter, read as a raised relief
  return (
    <g>
      {[0, 1, 2, 3, 4].map((k) => {
        const r = size * (0.62 - k * 0.11);
        const pts = Array.from({ length: 60 }, (_, i) => {
          const a = (i / 60) * Math.PI * 2;
          const rr = r * (1 + 0.13 * Math.sin(3 * a + k) + 0.07 * Math.cos(5 * a - k));
          return `${(cx + size * 0.06 + rr * Math.cos(a)).toFixed(1)},${(cy - size * 0.04 + rr * Math.sin(a)).toFixed(1)}`;
        }).join(" ");
        return <polygon key={k} points={pts} fill={mix(base, "#ffffff", 0.05 * (k + 1))} stroke={mix(base, "#000000", 0.18)} strokeWidth="1" />;
      })}
    </g>
  );
}

function Streets({ cx, cy, size, base }: { cx: number; cy: number; size: number; base: string }) {
  // plakat: a faint street grid under the route
  const s = size / 2;
  const c = tone(base);
  const lines = [[-1, -0.55, 1, -0.4], [-1, 0.05, 1, 0.2], [-1, 0.6, 1, 0.68], [-0.5, -1, -0.38, 1], [0.15, -1, 0.3, 1], [0.7, -1, 0.62, 1], [-1, -1, 1, 1]];
  return (
    <g stroke={c} strokeWidth={Math.max(1.2, size * 0.012)} strokeLinecap="round">
      {lines.map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={cx + x1 * s} y1={cy + y1 * s} x2={cx + x2 * s} y2={cy + y2 * s} />
      ))}
    </g>
  );
}

function Jigsaw({ cx, cy, size, base }: { cx: number; cy: number; size: number; base: string }) {
  // puzzle: 3×3 cut lines, a knob on every inner edge, alternating sides
  const n = 3, s = size / n, x0 = cx - size / 2, y0 = cy - size / 2, r = s * 0.13, k = r * 0.8;
  let d = "";
  for (let i = 1; i < n; i++)
    for (let j = 0; j < n; j++) {
      const flip = (i + j) % 2;
      const x = x0 + i * s, y = y0 + j * s + s / 2; // vertical cut, row j
      d += `M${x} ${y - s / 2}V${y - k}A${r} ${r} 0 1 ${flip} ${x} ${y + k}V${y + s / 2}`;
      const hx = x0 + j * s + s / 2, hy = y0 + i * s; // horizontal cut, column j
      d += `M${hx - s / 2} ${hy}H${hx - k}A${r} ${r} 0 1 ${flip} ${hx + k} ${hy}H${hx + s / 2}`;
    }
  return <path d={d} fill="none" stroke={mix(base, "#000000", 0.3)} strokeWidth={Math.max(1.2, size * 0.008)} />;
}

function FrameBox({ x, y, w, h, hex }: { x: number; y: number; w: number; h: number; hex: string }) {
  const b = 16;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={hex} filter="url(#pesan-shadow)" />
      <rect x={x + b} y={y + b} width={w - 2 * b} height={h - 2 * b} fill={mix(hex, "#000000", 0.28)} />
      <rect x={x + b + 2} y={y + b + 3} width={w - 2 * b - 2} height={h - 2 * b - 3} fill={MAT} />
    </g>
  );
}

function PhotoSlot({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#E8DDD0" />
      <circle cx={x + w * 0.7} cy={y + h * 0.28} r={w * 0.1} fill="#D4A574" />
      <polygon points={`${x},${y + h * 0.78} ${x + w * 0.35},${y + h * 0.45} ${x + w * 0.6},${y + h * 0.68} ${x + w * 0.78},${y + h * 0.52} ${x + w},${y + h * 0.75} ${x + w},${y + h} ${x},${y + h}`} fill="#588A63" />
      <text x={x + w / 2} y={y + h + 18} textAnchor="middle" fontSize="11" letterSpacing="2" fill="#4A3F38">FOTO KAMU</text>
    </g>
  );
}

/* ---------- geometry and colour helpers ---------- */

function rectPath(x: number, y: number, w: number, h: number, r: number) {
  return `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`;
}

const SIDES: Partial<Record<ShapeId, number>> = { triangle: 3, pentagon: 5, hexagon: 6, octagon: 8 };

function shapePath(shape: ShapeId, cx: number, cy: number, size: number) {
  const r = size / 2;
  if (shape === "rect") return rectPath(cx - r, cy - r, size, size, size * 0.02);
  if (shape === "rounded") return rectPath(cx - r, cy - r, size, size, size * 0.14);
  if (shape === "circle") return `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${size} 0a${r} ${r} 0 1 0 ${-size} 0Z`;
  const n = SIDES[shape]!;
  const start = -Math.PI / 2 + (n % 2 ? 0 : Math.PI / n); // odd: point up; even: flat top
  const dy = n === 3 ? r * 0.2 : 0; // a triangle's centre sits low, so shift it down to look centred
  const pts = Array.from({ length: n }, (_, i) => {
    const a = start + (i * 2 * Math.PI) / n;
    return `${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + dy + r * Math.sin(a)).toFixed(1)}`;
  });
  return `M${pts.join("L")}Z`;
}

function mix(a: string, b: string, t: number) {
  return "#" + [1, 3, 5].map((i) => Math.round(parseInt(a.slice(i, i + 2), 16) * (1 - t) + parseInt(b.slice(i, i + 2), 16) * t).toString(16).padStart(2, "0")).join("");
}

const luma = (h: string) => [1, 3, 5].reduce((s, i, k) => s + parseInt(h.slice(i, i + 2), 16) * [0.299, 0.587, 0.114][k], 0) / 255;
const tone = (h: string) => (luma(h) > 0.5 ? mix(h, "#000000", 0.1) : mix(h, "#ffffff", 0.14));

const WA_ICON =
  "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z";

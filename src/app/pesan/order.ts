// Everything the /pesan picker sells: options, prices (Rp) and the WhatsApp order text.
// Change prices here; the page reads them from this file.

export const WA_NUMBER = "6285121062948";

const keys = <T extends object>(o: T) => Object.keys(o) as (keyof T)[];

export const PRODUCTS = {
  terrain: { name: "Terrain", desc: "Topografi 3D", note: "Bukit dan lembah rute kamu, timbul", price: { S: 230000, M: 285000, L: 350000 } },
  plakat: { name: "Plakat", desc: "Plakat Rute 3D", note: "Rute timbul di atas peta jalan", price: { S: 135000, M: 175000, L: 220000 } },
  ganci: { name: "Gantungan Kunci", desc: "Kartu rute 8,5×5,4 cm", note: "Model kartu, muat di saku", price: 85000 },
} as const;

export const SIZES = { S: "10×10 cm", M: "12×12 cm", L: "15×15 cm" } as const;

// Same shapes route3d can cut (baseShape). Which product offers which: SHAPES_FOR below.
export const SHAPES = {
  rect: "Kotak",
  rounded: "Rounded",
  circle: "Bulat",
  triangle: "Segitiga",
  pentagon: "Segi Lima",
  hexagon: "Hexagon",
  octagon: "Segi Delapan",
} as const;

export const COLORS = {
  hitam: { name: "Hitam", hex: "#1B1B1D" },
  bone: { name: "Putih Bone", hex: "#EDE7D8" },
  kuning: { name: "Kuning", hex: "#F5C21B" },
  birumuda: { name: "Biru Muda", hex: "#17B6CE" },
  marun: { name: "Merah Marun", hex: "#7C2128" },
  abu: { name: "Abu-abu", hex: "#8B9095" },
  cokelat: { name: "Cokelat", hex: "#A9784E" },
  pink: { name: "Pink Lembut", hex: "#F2B4C4" },
  oranye: { name: "Oranye", hex: "#FC4C02" },
  birutua: { name: "Biru Tua", hex: "#1F2C5C" },
  zaitun: { name: "Hijau Zaitun", hex: "#6B7041" }, // ponytail: placeholder hex, none on record; swap in the real spool colour
} as const;

// price null = not set yet; the page and the chat message say it is confirmed in chat.
export const FRAMES = {
  none: { name: "Tanpa frame", price: 0 },
  frame: { name: "Frame saja", price: null },
  frame_photo: { name: "Frame + foto", price: 100000 },
} as const;

export const FRAME_COLORS = {
  natural: { name: "Kayu natural", hex: "#D8B98F" },
  white: { name: "Putih", hex: "#F1EEE8" },
  black: { name: "Hitam", hex: "#1F1C1A" },
  oak: { name: "Oak", hex: "#B98A5C" },
} as const;

export type ProductId = keyof typeof PRODUCTS;
export type SizeId = keyof typeof SIZES;
export type ShapeId = keyof typeof SHAPES;
export type ColorId = keyof typeof COLORS;
export type FrameId = keyof typeof FRAMES;
export type FrameColorId = keyof typeof FRAME_COLORS;

export const ids = {
  products: keys(PRODUCTS),
  sizes: keys(SIZES),
  shapes: keys(SHAPES),
  colors: keys(COLORS),
  frames: keys(FRAMES),
  frameColors: keys(FRAME_COLORS),
};

export type Order = {
  product: ProductId;
  shape: ShapeId;
  size: SizeId;
  base: ColorId;
  route: ColorId;
  frame: FrameId;
  frameColor: FrameColorId;
};

export const DEFAULT_ORDER: Order = {
  product: "terrain",
  shape: "rect",
  size: "M",
  base: "cokelat",
  route: "oranye",
  frame: "none",
  frameColor: "natural",
};

// Terrain: the shapes it has been made in (photos T05–T07, F04). Keychain is always the card.
export const SHAPES_FOR: Record<ProductId, readonly ShapeId[]> = {
  terrain: ["rect", "hexagon", "circle"],
  plakat: ids.shapes,
  ganci: [],
};

// Which picks apply to the chosen product. Leftover picks from another product are kept but ignored.
/** The shape that gets cut, or null for the keychain. A shape the product doesn't offer falls back to Kotak. */
export const shapeOf = (o: Order): ShapeId | null =>
  o.product === "ganci" ? null : SHAPES_FOR[o.product].includes(o.shape) ? o.shape : "rect";
export const hasSize = (o: Order) => o.product !== "ganci";
export const hasFrame = (o: Order) => o.product !== "ganci" && o.frame !== "none";

// Photos of Jejak's own pieces, in public/pesan/. Customer pieces only with the customer's OK.
// ai: an AI-made scene built from a real piece (files named AI_*); the page tags it "ilustrasi".
export type Photo = { src: string; alt: string; ai: boolean };
const photo = (file: string, alt: string, ai = false): Photo => ({ src: `/pesan/${file}.jpg`, alt, ai });
const PHOTOS: Record<string, Photo[]> = {
  "terrain-rect": [
    photo("F03_terrain-cokelat-oranye", "Terrain kotak cokelat, rute oranye"),
    photo("F01_terrain-hijau-oranye-di-tangan", "Terrain kotak hijau, rute oranye, di tangan"),
  ],
  "terrain-hexagon": [
    photo("F04_hex-terrain-cokelat-hitam-oranye", "Terrain hexagon cokelat dan hitam, rute oranye"),
    photo("T07_hex-plakat-merah-morning-trail", "Terrain hexagon merah, Morning Trail"),
    photo("T09_hex-plakat-krem-gravel-ride", "Terrain hexagon krem, rute hitam"),
  ],
  "terrain-circle": [
    photo("T05_terrain-bulat-biru-hijau-rute-oranye", "Terrain bulat biru dan hijau, rute oranye"),
    photo("T06_terrain-bulat-hijau-tua-rute-oranye", "Terrain bulat hijau tua, rute oranye"),
  ],
  "plakat-rect": [
    photo("F06_plakat-hitam-oranye", "Plakat kotak hitam, rute oranye"),
    photo("F07_plakat-merah-rute-hitam", "Plakat kotak merah, rute hitam"),
    photo("F08_plakat-zaitun-rute-putih", "Plakat kotak hijau zaitun, rute putih"),
  ],
  "plakat-circle": [photo("F10_plakat-bulat-pink", "Plakat bulat pink")],
  ganci: [
    photo("F12_gantungan-kunci-cokelat", "Gantungan kunci cokelat"),
    photo("F13_gantungan-kunci-putih-bone", "Gantungan kunci putih bone"),
  ],
  // Frame photos: "<product>-<frame>" first, else "<frame>".
  frame: [
    photo("AI_frame-hexagon-merah-di-rak", "Ilustrasi: frame kayu berisi terrain hexagon merah di rak", true),
    photo("F23_frame-kayu-hexagon-merah", "Frame kayu berisi terrain hexagon merah"),
  ],
  "terrain-frame_photo": [
    photo("AI_frame-terrain-hijau-foto-gunung", "Ilustrasi: frame kayu berisi terrain hijau dan foto gunung", true),
    photo("F24_frame-kayu-terrain-hijau-dan-slot-foto", "Frame kayu berisi terrain hijau dan slot foto"),
  ],
  "plakat-frame_photo": [
    photo("AI_frame-plakat-merah-foto-hutan", "Ilustrasi: frame kayu berisi plakat merah dan foto hutan", true),
    photo("F24_frame-kayu-terrain-hijau-dan-slot-foto", "Frame kayu berisi terrain hijau dan slot foto"),
  ],
};

/** Up to 3 real photos for the current pick: the frame first, then the piece. Empty when there is none yet. */
export function examples(o: Order) {
  const shape = shapeOf(o);
  const piece = PHOTOS[shape ? `${o.product}-${shape}` : o.product] ?? [];
  const frame = hasFrame(o) ? PHOTOS[`${o.product}-${o.frame}`] ?? PHOTOS[o.frame] : [];
  return [...frame, ...piece].slice(0, 3);
}

export const rupiah = (n: number) => "Rp " + n.toLocaleString("id-ID");

export type Quote = { lines: { label: string; amount: number | null }[]; total: number; pending: boolean };

export function quote(o: Order): Quote {
  const p = PRODUCTS[o.product];
  const lines: Quote["lines"] = [];
  if (typeof p.price === "number") lines.push({ label: `${p.name} (${p.desc})`, amount: p.price });
  else lines.push({ label: `${p.name} ${o.size} (${SIZES[o.size]})`, amount: p.price[o.size] });
  if (hasFrame(o)) lines.push({ label: `${FRAMES[o.frame].name}, ${FRAME_COLORS[o.frameColor].name}`, amount: FRAMES[o.frame].price });
  return {
    lines,
    total: lines.reduce((sum, l) => sum + (l.amount ?? 0), 0),
    pending: lines.some((l) => l.amount === null),
  };
}

export function waLink(o: Order): string {
  const p = PRODUCTS[o.product];
  const q = quote(o);
  const rows = [
    "Halo Jejak! Saya mau pesan:",
    `- Produk: ${p.name} (${p.desc})`,
    hasSize(o) && `- Ukuran: ${o.size} (${SIZES[o.size]})`,
    shapeOf(o) && `- Bentuk: ${SHAPES[shapeOf(o)!]}`,
    `- Warna: base ${COLORS[o.base].name}, rute ${COLORS[o.route].name}`,
    hasFrame(o) && `- Frame: ${FRAMES[o.frame].name}, warna ${FRAME_COLORS[o.frameColor].name}`,
    `Estimasi: ${rupiah(q.total)}${q.pending ? " + harga frame (mohon info)" : ""}`,
    hasFrame(o) && o.frame === "frame_photo"
      ? "Rute (GPX/Strava) dan fotonya saya kirim di chat ini ya."
      : "Rute (GPX/Strava) saya kirim di chat ini ya.",
  ];
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(rows.filter(Boolean).join("\n"))}`;
}

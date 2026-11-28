// Run: npx tsx --test src/app/pesan/order.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { quote, waLink, rupiah, examples, ids, DEFAULT_ORDER, type Order, type Photo } from "./order";

const o = (patch: Partial<Order>): Order => ({ ...DEFAULT_ORDER, ...patch });
const waText = (order: Order, from?: Photo) => decodeURIComponent(waLink(order, from).split("?text=")[1]);

test("tapping a photo picks that piece; the order names the photo until a pick changes", () => {
  for (const product of ids.products)
    for (const shape of ids.shapes)
      for (const frame of ids.frames)
        for (const p of examples(o({ product, shape, frame }))) {
          const picked = { ...o({ product, shape, frame }), ...p.pick };
          assert.ok(examples(picked).some((x) => x.src === p.src), `${p.src} drops out of the strip once tapped`);
          assert.ok(waText(picked, p).includes(`- Seperti contoh: ${p.alt}`), p.src);
        }
  const f07 = examples(o({ product: "plakat", shape: "rect" })).find((p) => p.src.includes("/F07_"))!;
  const picked = o(f07.pick);
  assert.deepEqual([picked.product, picked.base, picked.route], ["plakat", "marun", "hitam"]);
  assert.doesNotMatch(waText({ ...picked, route: "kuning" }, f07), /Seperti contoh/);
});

test("rupiah uses Indonesian thousands dots", () => {
  assert.equal(rupiah(135000), "Rp 135.000");
  assert.equal(rupiah(1234567), "Rp 1.234.567");
});

test("terrain M, no frame", () => {
  const q = quote(o({ product: "terrain", size: "M", frame: "none" }));
  assert.equal(q.total, 285000);
  assert.equal(q.pending, false);
});

test("plakat S hexagon with frame + foto adds 100.000", () => {
  const q = quote(o({ product: "plakat", size: "S", shape: "hexagon", frame: "frame_photo" }));
  assert.equal(q.total, 235000);
  assert.equal(q.pending, false);
});

test("frame saja has no price yet, so the total is pending", () => {
  const q = quote(o({ product: "plakat", size: "L", frame: "frame" }));
  assert.equal(q.total, 220000);
  assert.equal(q.pending, true);
  assert.match(waText(o({ product: "plakat", size: "L", frame: "frame" })), /harga frame/i);
});

test("puzzle: S/M/L prices, kotak only, frames priced as usual, no example photos yet", () => {
  assert.equal(quote(o({ product: "puzzle", size: "S" })).total, 300000);
  assert.equal(quote(o({ product: "puzzle", size: "M" })).total, 350000);
  assert.equal(quote(o({ product: "puzzle", size: "L", frame: "frame_photo" })).total, 500000);
  assert.match(waText(o({ product: "puzzle", shape: "hexagon" })), /Produk: Puzzle \(Puzzle Rute 3D\)\n- Ukuran: M \(12×12 cm\)\n- Bentuk: Kotak/);
  for (const frame of ids.frames) assert.deepEqual(examples(o({ product: "puzzle", frame })), []);
});

test("keychain ignores leftover size, shape and frame picks", () => {
  const order = o({ product: "ganci", size: "L", shape: "hexagon", frame: "frame_photo" });
  const q = quote(order);
  assert.equal(q.total, 85000);
  assert.equal(q.lines.length, 1);
  const text = waText(order);
  assert.doesNotMatch(text, /Frame|Bentuk|Hexagon/);
  assert.match(waText(o({ product: "ganci", base: "kuning", route: "birutua" })), /Warna: base Kuning, rute Biru Tua/);
});

test("terrain comes in kotak, hexagon and bulat; a plakat-only shape falls back to kotak", () => {
  assert.match(waText(o({ product: "terrain", shape: "hexagon" })), /Bentuk: Hexagon/);
  assert.match(waText(o({ product: "terrain", shape: "circle" })), /Bentuk: Bulat/);
  assert.match(waText(o({ product: "terrain", shape: "triangle" })), /Bentuk: Kotak/);
  assert.equal(quote(o({ product: "terrain", size: "M", shape: "hexagon" })).total, 285000); // same price as kotak
});

test("example photos: frame first, max 3, every file exists", () => {
  const framed = examples(o({ product: "terrain", shape: "rect", frame: "frame_photo" }));
  assert.deepEqual(framed.map((p) => [p.src.match(/\/pesan\/(\w+?)_/)![1], p.ai]), [["AI", true], ["F24", false], ["F03", false]]);
  assert.match(examples(o({ product: "plakat", frame: "frame_photo" }))[0].src, /AI_frame-plakat/);
  assert.match(examples(o({ product: "plakat", frame: "frame" }))[0].src, /AI_frame-hexagon/);
  for (const p of [framed, examples(o({ product: "ganci" }))].flat()) assert.equal(p.ai, p.src.includes("/AI_"));
  assert.ok(framed.length <= 3);
  assert.deepEqual(examples(o({ product: "plakat", shape: "triangle" })), []);
  for (const product of ids.products)
    for (const shape of ids.shapes)
      for (const frame of ids.frames)
        for (const p of examples(o({ product, shape, frame })))
          assert.ok(existsSync(new URL(`../../../public${p.src}`, import.meta.url)), `missing ${p.src}`);
});

test("whatsapp link goes to Jejak's number with the order typed out", () => {
  const order = o({ product: "plakat", size: "M", shape: "circle", base: "hitam", route: "oranye", frame: "frame_photo", frameColor: "oak" });
  const link = waLink(order);
  assert.ok(link.startsWith("https://wa.me/6285121062948?text="));
  const text = waText(order);
  for (const part of ["Plakat", "M (12×12 cm)", "Bulat", "Hitam", "Oranye", "Frame + foto", "Oak", "Rp 275.000"]) {
    assert.ok(text.includes(part), `missing "${part}" in:\n${text}`);
  }
});

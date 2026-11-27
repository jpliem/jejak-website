// Run: npx tsx --test src/app/pesan/order.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { quote, waLink, rupiah, examples, ids, DEFAULT_ORDER, type Order } from "./order";

const o = (patch: Partial<Order>): Order => ({ ...DEFAULT_ORDER, ...patch });
const waText = (order: Order) => decodeURIComponent(waLink(order).split("?text=")[1]);

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

import { test } from "node:test";
import assert from "node:assert/strict";
import { parseDate, findDate } from "../js/date.js";
import { sendToGoogleSheet } from "../js/google.js";
test("validates real calendar dates and preserves years", () => {
  assert.equal(parseDate("29.02.2028"), "29.02.2028");
  assert.equal(parseDate("29.02.2027"), null);
  assert.equal(parseDate("31.04.2027"), null);
  assert.equal(parseDate("2027-12-15"), "15.12.2027");
  assert.equal(parseDate("15.12.2099"), "15.12.2099");
  assert.equal(parseDate("15.12.27"), null);
  assert.equal(parseDate("garbage"), null);
});
test("extracts OCR candidates without inventing dates", () => {
  assert.equal(findDate([{ text: "MHD: 15.12.2O37" }]), "15.12.2037");
  assert.equal(findDate([{ text: "31.02.2026" }]), null);
  assert.equal(findDate([{ text: "MHD 2028-02-29" }]), "29.02.2028");
});
test("submission requires explicit server confirmation", async () => {
  await assert.rejects(
    sendToGoogleSheet({}, () => {}),
    /尚未設定/,
  );
  const original = globalThis.fetch;
  try {
    globalThis.fetch = async () => new Response(JSON.stringify({ ok: false }));
    await assert.rejects(
      sendToGoogleSheet({}, () => {}, "https://example.test"),
      /未確認/,
    );
    globalThis.fetch = async () => new Response(JSON.stringify({ ok: true }));
    assert.equal(
      await sendToGoogleSheet({}, () => {}, "https://example.test"),
      true,
    );
    globalThis.fetch = async () => new Response("failure", { status: 500 });
    await assert.rejects(
      sendToGoogleSheet({}, () => {}, "https://example.test"),
      /回應失敗/,
    );
  } finally {
    globalThis.fetch = original;
  }
});

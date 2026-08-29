// Demo listings lifted from the original prototype.
//
// THESE ARE FICTIONAL HOMES WITH FAKE PHONE NUMBERS. They exist so the site can
// be shown working before real listings are collected. Remove them before
// carehomes.lk is public — a real family ringing an invented number looking for
// care for a parent is the failure this guards against.
//
// prisma/demo-homes.json is the single source, so the admin action and the
// startup seed script cannot drift apart.

import demo from "../../prisma/demo-homes.json";

export type DemoHome = (typeof demo)[number];

export const DEMO_HOMES: DemoHome[] = demo;
export const DEMO_SLUGS: string[] = demo.map((h) => h.slug);

import { describe, it, expect, beforeAll } from "bun:test";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const README_PATH = join(import.meta.dir, "..", "README.md");

describe("README.md - CodeRabbit Test section", () => {
  let content: string;

  beforeAll(() => {
    content = readFileSync(README_PATH, "utf-8");
  });

  it("README.md exists", () => {
    expect(existsSync(README_PATH)).toBe(true);
  });

  it("contains the CodeRabbit Test heading", () => {
    expect(content).toContain("## CodeRabbit Test");
  });

  it("CodeRabbit Test heading uses exactly level-2 markdown (##)", () => {
    expect(content).toMatch(/^## CodeRabbit Test$/m);
  });

  it("does not use a level-1 heading for CodeRabbit Test", () => {
    expect(content).not.toMatch(/^# CodeRabbit Test$/m);
  });

  it("does not use a level-3 heading for CodeRabbit Test", () => {
    expect(content).not.toMatch(/^### CodeRabbit Test$/m);
  });

  it("contains the CodeRabbit description text", () => {
    expect(content).toContain(
      "This repository is connected to CodeRabbit for automated pull request reviews."
    );
  });

  it("description text appears after the CodeRabbit Test heading", () => {
    const headingIndex = content.indexOf("## CodeRabbit Test");
    const descriptionIndex = content.indexOf(
      "This repository is connected to CodeRabbit for automated pull request reviews."
    );
    expect(headingIndex).toBeGreaterThanOrEqual(0);
    expect(descriptionIndex).toBeGreaterThan(headingIndex);
  });

  it("retains the original Getting Started section", () => {
    expect(content).toContain("## Getting Started");
    expect(content).toContain("bun create elysia ./elysia-example");
  });

  it("retains the original Development section", () => {
    expect(content).toContain("## Development");
    expect(content).toContain("bun run dev");
  });

  it("retains the localhost link text", () => {
    expect(content).toContain("Open http://localhost:3000/ with your browser to see the result.");
  });

  it("CodeRabbit Test section appears after the Development section", () => {
    const devIndex = content.indexOf("## Development");
    const codeRabbitIndex = content.indexOf("## CodeRabbit Test");
    expect(devIndex).toBeGreaterThanOrEqual(0);
    expect(codeRabbitIndex).toBeGreaterThan(devIndex);
  });

  it("file ends with a newline", () => {
    expect(content.endsWith("\n")).toBe(true);
  });
});

import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import type { Page, Locator } from '@playwright/test';

type VisualOptions = {
    baselineDir?: string;   // default 'visual-baseline'
    actualDir?: string;     // default 'visual-actual'
    diffDir?: string;       // default 'visual-diff'
    threshold?: number;     // pixelmatch threshold (0-1)
    fullPage?: boolean;
    updateBaseline?: boolean;
};

const ensureDir = (p: string) => { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); };

const defaultOpts = (o?: VisualOptions) => ({
    baselineDir: 'visual-baseline',
    actualDir: 'visual-actual',
    diffDir: 'visual-diff',
    threshold: 0.1,
    fullPage: false,
    updateBaseline: false,
    ...o,
});

export async function captureScreenshot(page: Page, name: string, opts?: VisualOptions, locator?: Locator): Promise<Buffer> {
    const o = defaultOpts(opts);
    if (locator) {
        return await locator.screenshot({ mask: [], animations: 'disabled' });
    }
    return await page.screenshot({ fullPage: o.fullPage, animations: 'disabled' });
}

export function baselinePath(name: string, dir: string) {
    return path.join(dir, `${name}.png`);
}

export async function saveBaseline(name: string, buffer: Buffer, opts?: VisualOptions) {
    const o = defaultOpts(opts);
    ensureDir(o.baselineDir!);
    fs.writeFileSync(baselinePath(name, o.baselineDir!), buffer);
}

export function readBaseline(name: string, opts?: VisualOptions): Buffer | null {
    const o = defaultOpts(opts);
    const p = baselinePath(name, o.baselineDir!);
    return fs.existsSync(p) ? fs.readFileSync(p) : null;
}

export function writeActualAndDiff(name: string, actualBuffer: Buffer, diffPNG: PNG | null, opts?: VisualOptions) {
    const o = defaultOpts(opts);
    ensureDir(o.actualDir!);
    ensureDir(o.diffDir!);
    fs.writeFileSync(path.join(o.actualDir!, `${name}.png`), actualBuffer);
    if (diffPNG) {
        const diffPath = path.join(o.diffDir!, `${name}.png`);
        fs.writeFileSync(diffPath, PNG.sync.write(diffPNG));
    }
}

export function compareBuffers(baselineBuf: Buffer, actualBuf: Buffer, threshold: number) {
    const base = PNG.sync.read(baselineBuf);
    const actual = PNG.sync.read(actualBuf);

    if (base.width !== actual.width || base.height !== actual.height) {
        return { matched: false, diffPNG: null, reason: 'dimensions-mismatch', width: Math.max(base.width, actual.width), height: Math.max(base.height, actual.height) };
    }

    const diff = new PNG({ width: base.width, height: base.height });
    const diffPixels = pixelmatch(base.data, actual.data, diff.data, base.width, base.height, { threshold });
    const matched = diffPixels === 0;
    return { matched, diffPNG: matched ? null : diff, diffPixels, width: base.width, height: base.height };
}

export async function expectVisualMatch(page: Page, name: string, opts?: VisualOptions, locator?: Locator) {
    const o = defaultOpts(opts);
    const actualBuf = await captureScreenshot(page, name, o, locator);
    ensureDir(o.actualDir!);
    fs.writeFileSync(path.join(o.actualDir!, `${name}.png`), actualBuf);

    const baseline = readBaseline(name, o);
    if (!baseline) {
        if (o.updateBaseline) {
            await saveBaseline(name, actualBuf, o);
            return { status: 'baseline-saved' };
        }
        return { status: 'no-baseline', message: 'Baseline missing. Run with updateBaseline=true to create it.' };
    }

    const result = compareBuffers(baseline, actualBuf, o.threshold!);
    if (!result.matched) {
        writeActualAndDiff(name, actualBuf, result.diffPNG, o);
        if (o.updateBaseline) {
            await saveBaseline(name, actualBuf, o);
            return { status: 'updated-baseline', diffPixels: result.diffPixels };
        }
        return { status: 'mismatch', diffPixels: result.diffPixels, diffPath: path.join(o.diffDir!, `${name}.png`) };
    }
    return { status: 'matched' };
}
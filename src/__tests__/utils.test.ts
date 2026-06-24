import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isValidCoords } from '../utils/coords';
import { convertTemp } from '../utils/weather';
import { createCache } from '../utils/cache';

// ── isValidCoords ──
describe('isValidCoords', () => {
  it('accepts valid coordinates', () => {
    expect(isValidCoords('48.8566', '2.3522')).toBe(true);
  });

  it('rejects lat out of range', () => {
    expect(isValidCoords('91', '0')).toBe(false);
    expect(isValidCoords('-91', '0')).toBe(false);
  });

  it('rejects lon out of range', () => {
    expect(isValidCoords('0', '181')).toBe(false);
    expect(isValidCoords('0', '-181')).toBe(false);
  });

  it('rejects non-numeric values', () => {
    expect(isValidCoords('abc', '2.3522')).toBe(false);
    expect(isValidCoords('48.8566', 'xyz')).toBe(false);
  });

  it('accepts boundary values', () => {
    expect(isValidCoords('90', '180')).toBe(true);
    expect(isValidCoords('-90', '-180')).toBe(true);
  });
});

// ── convertTemp ──
describe('convertTemp', () => {
  it('returns Celsius rounded', () => {
    expect(convertTemp(20.6, 'C')).toBe(21);
    expect(convertTemp(20.4, 'C')).toBe(20);
  });

  it('converts to Fahrenheit', () => {
    expect(convertTemp(0, 'F')).toBe(32);
    expect(convertTemp(100, 'F')).toBe(212);
    expect(convertTemp(-40, 'F')).toBe(-40);
  });
});

// ── createCache ──
describe('createCache', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('returns null for missing key', () => {
    const cache = createCache<string>();
    expect(cache.get('missing')).toBeNull();
  });

  it('returns stored value', () => {
    const cache = createCache<string>();
    cache.set('key', 'hello');
    expect(cache.get('key')).toBe('hello');
  });

  it('returns null after TTL expires', () => {
    const cache = createCache<string>();
    cache.set('key', 'hello');
    vi.advanceTimersByTime(11 * 60 * 1000); // 11 minutes
    expect(cache.get('key')).toBeNull();
  });

  it('returns value before TTL expires', () => {
    const cache = createCache<string>();
    cache.set('key', 'hello');
    vi.advanceTimersByTime(9 * 60 * 1000); // 9 minutes
    expect(cache.get('key')).toBe('hello');
  });
});

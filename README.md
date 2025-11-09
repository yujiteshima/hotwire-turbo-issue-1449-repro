# Hotwire Turbo Issue #1449 Reproduction

This repository reproduces the bug described in [hotwired/turbo#1449](https://github.com/hotwired/turbo/issues/1449), where scroll position wasn't reset when navigating to error pages (404, 500).

**✅ Fix included:** This repo includes the fix from [PR #1462](https://github.com/hotwired/turbo/pull/1462)

**Status:** The fix uses `performScroll()` to ensure scroll behavior is handled consistently for all response types (2XX and non-2XX)

## The Bug (Original Issue)

When navigating to error pages (404, 500) via link clicks, the scroll position wasn't reset to the top, even though the page was scrolled down.

**Expected behavior:** Scroll position resets to top when navigating to error pages
**Actual behavior (before fix):** Scroll position remained unchanged, making error messages invisible without manual scrolling

**Root cause:** `performScroll()` wasn't being called for error responses in the visit.js implementation

## Try the Fix!

This repo includes both the broken and fixed versions for comparison:

- **Broken (Turbo 8.0.14):** http://localhost:3000/scroll_8_0_14
- **Fixed (Latest from PR #1462):** http://localhost:3000/scroll_fixed

### How to Test

1. Open either version
2. Scroll to the bottom of the page
3. Click "404" or "500" link
4. **Broken version:** Page stays scrolled down (bug) ❌
5. **Fixed version:** Page scrolls to top (fixed!) ✅

### The Fix

The fix is simple and elegant - just call `performScroll()` after rendering error responses:

```javascript
// Before (manual scroll handling)
const currentSnapshot = this.view.snapshot
const preserveScroll = currentSnapshot.refreshScroll === "preserve"
const scrollPosition = preserveScroll ? { x: window.scrollX, y: window.scrollY } : null

await this.view.renderError(PageSnapshot.fromHTMLString(responseHTML), this)

if (preserveScroll && scrollPosition) {
  this.view.scrollToPosition(scrollPosition)
} else if (!this.scrollToAnchor()) {
  this.view.scrollToTop()
}
this.scrolled = true

// After (use performScroll)
await this.view.renderError(PageSnapshot.fromHTMLString(responseHTML), this)
this.performScroll()
```

This ensures scroll behavior is handled consistently with successful responses.

## Setup

```bash
npm install
npm start
```

Visit http://localhost:3000

## Manual Testing

1. Scroll down to the bottom of the page
2. Click any of the links in the fixed navigation bar
3. Observe whether the next page scrolls to the top

### Test Cases

| Link | Status | Expected | Actual (Turbo 8.0.14) |
|------|--------|----------|----------------------|
| 200 OK | 200 | Reset ✓ | Reset ✓ |
| 302 → 200 | 302→200 | Reset ✓ | Reset ✓ (at final 200) |
| 404 | 404 | Reset ✓ | **No reset ✗** (bug) |
| 500 | 500 | Reset ✓ | **No reset ✗** (bug) |
| 302 → 404 | 302→404 | Reset ✓ | **No reset ✗** (bug) |
| 302 → 500 | 302→500 | Reset ✓ | **No reset ✗** (bug) |

## Automated Testing

```bash
npm test
```

The tests verify the bug by checking scroll position after navigation:
- ✅ **5 passing tests** - Confirm the bug exists (404/500 don't reset scroll)
- ❌ **1 failing test** - 302→200 resets at the final 200 response

### Why 302→404 and 302→500 tests matter

These tests prove that the bug exists in the redirect (302) response itself, not just in error pages:
- 404 alone doesn't reset (known bug)
- 302→404 also doesn't reset (proves 302 has the bug too)
- If Turbo is fixed and 302→404 **does** reset, it means 302 now properly handles scroll reset

## Test Results

```
Running 6 tests using 6 workers

✓ 200 OK resets scroll
✓ 404 keeps scroll (bug)
✓ 500 keeps scroll (bug)
✓ 302→404 keeps scroll (bug)
✓ 302→500 keeps scroll (bug)
✗ 302→200 resets (at final 200)

5 passed, 1 failed
```

## Technical Details

- **Turbo Version:** 8.0.14
- **CDN:** jsDelivr (switched from Skypack due to build errors)
- **Test Framework:** Playwright
- **Server:** Express.js

All pages include `<meta name="turbo-refresh-scroll" content="reset">` and have scrollable content (2000px height) to verify scroll behavior.

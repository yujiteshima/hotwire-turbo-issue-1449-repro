# Hotwire Turbo Issue #1449 Reproduction

This repository reproduces the bug described in [hotwired/turbo#1449](https://github.com/hotwired/turbo/issues/1449), where `turbo-refresh-scroll="reset"` only works with 2XX status codes and fails with non-2XX responses (3XX, 4XX, 5XX).

## The Bug

The `<meta name="turbo-refresh-scroll" content="reset">` tag should reset scroll position to the top when navigating to a new page, regardless of HTTP status code. However, it currently only works with 2XX responses.

**Expected behavior:** Scroll reset works for all HTTP status codes
**Actual behavior:** Scroll reset only works for 2XX status codes

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

# Hero fullscreen on installed iOS apps

The reported top-left / partial-screen rendering was not reproduced in the available Chromium browser. A physical iPhone is still required to confirm the fix; this is a defensive layout and capability fix, not a confirmed WebKit root-cause diagnosis.

Previously, the fallback reused the generic centered dialog (50% offsets, negative translation, width caps and zoom animations), then attempted to override those styles. It also attempted native fullscreen whenever the method existed, including installed apps.

The fallback now uses a dedicated Base UI popup portaled outside the hero, with explicit viewport bounds and no centered-dialog utilities. Modal focus trapping, background scroll locking, Escape and focus restoration remain provided by Base UI. Installed standalone/fullscreen apps, including legacy iOS navigator.standalone, use this overlay directly. Other browsers retain native fullscreen when enabled, with the overlay on rejection. Controls account for safe-area insets and short landscape windows.

The overlay fills the available app viewport. It does not promise to hide OS-owned status bars or change the app's installation metadata.

## Checks performed

- Production build and existing test suite pass.
- Temporary local harness with requestFullscreen absent: popup and SVG both measured at (0, 0), 480 × 844 in portrait.
- Simulated navigator.standalone with a native-request sentinel: no native request occurred; popup and SVG both measured at (0, 0), 844 × 390 in landscape. Heading, controls and attribution were within bounds without overlapping.
- Exit removes the popup and returns focus to the hero fullscreen button; reopening works. Pause and reset controls work.
- Browser screenshot capture at overridden viewport sizes produced inconsistent scaling, so these checks use DOM geometry and are not a substitute for real-device visual testing.
- Temporary harness removed after checks.

## Real-device verification

Open the updated site from its home-screen icon, expand the animation, rotate both ways, pause/reset, exit and reopen. Confirm the SVG covers the available viewport and Exit remains reachable. Repeat in Safari. If a partial view remains, record the iOS version, device model, orientation and a screenshot to distinguish viewport sizing from SVG painting issues.

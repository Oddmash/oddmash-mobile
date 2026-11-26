# Pull to Refresh (P0)

Refresh a scrollable list at its upper boundary without replacing the existing data.

Proposed API: Root with onRefresh returning a promise, disabled, optional controlled refreshing state and threshold. Indicator reflects idle, pulling, armed, refreshing, success or error. Avoid duplicate concurrent requests, ignore stale completion after unmount, restore content position, offer visible refresh button and accessible status.

Acceptance: starts only at correct scroll boundary, does not compete with nested scroll, no request below threshold, exactly one request after valid release, success and error recover to idle, no endless spinner. Document browser-native refresh conflicts and opt-in overscroll strategy; never disable global scrolling by default.

# Shared location audit

GPS refresh now preserves the distance limit when staying in the same city. Changing cities clears GPS and resets nearest sorting. A failed refresh clears the previous position, distance labels and location marker instead of silently continuing to use old coordinates. Browser and Capacitor permission-denied errors are recognized, and synchronous provider failures settle the pending request.

Map markers and distance filtering share coordinate validation, rejecting empty strings, booleans and out-of-range values while accepting valid zero coordinates. A delayed profile location request refreshes the current screen instead of navigating back to the profile.

`work/check-location.cjs` covers browser/native callbacks, radius preservation, known straight-line distances, permission denial, city/account races and malformed coordinates. `work/check-location-browser.cjs` runs real map resources with simulated GPS against both web and packaged Android assets, including labels, radius filtering, refresh, denied access and city changes. Existing dietary/pure-veg and recommendation regressions remain required.

Distances are straight-line kilometres, not driving routes. Physical Android GPS/permission settings were not tested. No backend or database migration is required; both clients use the same source and contracts.

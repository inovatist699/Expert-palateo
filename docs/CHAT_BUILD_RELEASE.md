# Chat reference web build

The reviewed web surface is implemented by src/shared/ui/studio-screens.js and src/styles/studio.css. It keeps the approved teal/gold five-tab interface, existing venue photos, map layout, Pal-O visibility controls, coming-soon Circle and Beta Ask Pal-O. Existing repository backend, native bridge and mobile build isolation remain in place.

You contains the Genome Studio controls plus optional Budget tier and Distance filter. The duplicate Your preferences summary and Retake taste quiz action are removed. Budget defaults to Any budget. Distance offers 0–50 km, with the final 50+ position meaning anywhere in the selected city. A finite distance requires location; denial or unavailability falls back to anywhere. Changing city clears the optional range. A stale permission response cannot overwrite a newer filter choice. Live dish calibration is labeled Beta.

Map renders all matching catalogue cards and valid-coordinate pins. Feedback/save/undo preserve the viewed card and desktop sheet position while taste ranking updates.

Verification: 12 regression suites, CSP checks and Playwright tests covering optional values, permission denial/success, stale callbacks, zero range, unlimited range and responsive You layouts. GPS checks use browser mocks; no real account writes are used by the local preview.

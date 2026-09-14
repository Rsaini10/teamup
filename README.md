Error 1: Vite dev server crash — "Cannot find native binding"
Error: Cannot find native binding. npm has a bug related to optional dependencies
Cannot find module '@rolldown/binding-win32-x64-msvc'
Cause: npm's known optional-dependency bug, made worse because the installed Node version (v20.12.2) was below what Vite 8's rolldown build requires (≥20.19 or ≥22.12).
Solution: Downgraded to a stable Vite version that doesn't need the rolldown native binding.



Error 2: "Post Listing" button not working
Symptom: Clicking the button did nothing — no error, no new listing.
Cause: One or more required fields were empty, so the browser's built-in HTML5 validation silently blocked submission (no JS error, no network request fired).
Solution: Filled in every required field before submitting; used browser DevTools (Console + Network tabs) to confirm whether the click handler fired and whether a request was sent.



Error 3: CORS policy blocked request
Cause:
The backend uses app.use(cors()) with no configuration, which by default should allow all origins — but this error typically shows up when:
The backend crashed or wasn't restarted after a change, so the old server (without CORS enabled) is still responding, or
cors() is applied after your routes are defined instead of before, so it never runs for those routes, or
You've restricted cors() to a specific origin that doesn't match your frontend's actual URL.
Solution:
cors() is applied before your routes in server.js

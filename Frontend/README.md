# CampusHub — Auth UI

A role-based login/register frontend for CampusHub (Student / Professor / Admin), built with React + Tailwind CSS, ready to wire up to your backend.

## Setup

```bash
npm install
cp .env.example .env      # then set VITE_API_BASE_URL
npm run dev
```

Requires Tailwind's CDN or the packages in `package.json` (already listed as dev dependencies — `npm install` pulls them in).

## File structure

```
src/
  App.jsx                    # routes between Login/Register, dark mode, API calls, toasts
  main.jsx                   # Vite entry point
  index.css                  # fonts, Tailwind layers, focus styles
  components/
    FormInput.jsx            # labeled input, icon, error text, password show/hide
    PasswordStrength.jsx     # 4-bar strength meter
    RoleSelector.jsx         # dropdown (login) + segmented tabs (register)
    AuthSidePanel.jsx        # branded left panel, copy changes per role
    Toast.jsx                # success/error notifications
  pages/
    LoginPage.jsx
    RegisterPage.jsx         # student/professor/admin field sets + success screen
```

## Backend wiring

`App.jsx` calls `fetch` directly against the endpoints from the brief:

| Action | Endpoint |
|---|---|
| Student login | `POST /auth/login/student` |
| Professor login | `POST /auth/login/professor` |
| Admin login | `POST /auth/login/admin` |
| Student register | `POST /auth/register/student` |
| Professor register | `POST /auth/register/professor` |
| Admin register | `POST /auth/register/admin` |

Expected responses:
- Success: `{ id, accessToken, refreshToken }` — tokens are stored in `localStorage`.
- Error: `{ message: "..." }` — shown inline as a red alert on the form.

To point this at your API, set `VITE_API_BASE_URL` in `.env`. To hand off to your router after login (e.g. React Router), edit the comment in `handleLogin` inside `App.jsx`.

## Notes

- Role selection is a native `<select>` on Login (as specified) and a segmented tab control on Register, since it swaps a whole block of fields — both call the same `RoleSelector` component.
- Password strength is a client-side visual hint only; keep real strength/breach checks server-side.
- Dark mode toggles a `dark` class on `<html>`; extend `tailwind.config.js` / `index.css` if you want more than the current login/register screens themed.
- All interactive controls are at least 44px tall and have visible keyboard focus rings for accessibility.

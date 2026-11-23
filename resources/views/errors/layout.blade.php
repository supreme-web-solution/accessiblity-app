<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title') - {{ config('app.name') }}</title>
    <style>
        :root { color-scheme: light dark; }
        * { box-sizing: border-box; }
        body {
            margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 24px;
            font-family: Inter, "Segoe UI", system-ui, Arial, sans-serif;
            background: radial-gradient(900px 400px at 10% -10%, rgba(22, 99, 215, .18), transparent 70%), #f6f8fc;
            color: #141b2d;
        }
        .card { width: 100%; max-width: 520px; background: #fff; border: 1px solid #e2e8f0; border-radius: 22px; padding: 40px 32px; text-align: center; box-shadow: 0 30px 60px -30px rgba(20, 27, 45, .35); }
        .icon { width: 64px; height: 64px; border-radius: 20px; margin: 0 auto 20px; display: grid; place-items: center; background: linear-gradient(135deg, #1663d7, #6aa2ff); color: #fff; }
        .code { font-size: 13px; font-weight: 700; letter-spacing: .08em; color: #1663d7; text-transform: uppercase; }
        h1 { font-size: 26px; margin: 8px 0 10px; letter-spacing: -.01em; }
        p.muted { color: #4a5566; margin: 0 0 26px; line-height: 1.6; }
        .actions { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; }
        .btn { display: inline-block; padding: 12px 18px; border-radius: 12px; font-weight: 700; text-decoration: none; border: 2px solid #1663d7; background: #1663d7; color: #fff; }
        .btn-ghost { background: #fff; color: #1663d7; border-color: #cfd9ea; }
        .btn:focus-visible { outline: 3px solid #ffd400; outline-offset: 3px; }
        @media (prefers-color-scheme: dark) {
            body { background: radial-gradient(900px 400px at 10% -10%, rgba(106, 162, 255, .18), transparent 70%), #0d1220; color: #eef3fb; }
            .card { background: #161f33; border-color: #26324d; }
            h1 { color: #eef3fb; }
            p.muted { color: #b7c2d6; }
            .btn-ghost { background: #161f33; color: #eef3fb; border-color: #26324d; }
        }
    </style>
</head>
<body>
    <main class="card">
        <div class="icon" aria-hidden="true">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>
        </div>
        <p class="code">Error @yield('code')</p>
        <h1>@yield('heading')</h1>
        <p class="muted">@yield('message')</p>
        <div class="actions">
            @yield('actions')
        </div>
    </main>
</body>
</html>

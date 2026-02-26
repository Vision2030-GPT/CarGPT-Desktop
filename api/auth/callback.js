// CarGPT OAuth Callback — handles redirect from Google/Apple sign-in
// GET /auth/callback — Supabase redirects here with tokens in URL hash

export default function handler(req, res) {
  // Supabase sends tokens as URL hash fragments (#access_token=xxx)
  // Hash fragments aren't sent to the server, so we need a client-side page
  // to extract them and store in sessionStorage
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(`<!DOCTYPE html>
<html>
<head>
  <title>CarGPT — Signing in...</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: #F9FAFB; }
    .card { text-align: center; padding: 40px; background: white; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.08); max-width: 400px; }
    .logo { font-size: 28px; font-weight: 800; margin-bottom: 16px; }
    .logo span { color: #2563EB; }
    .spinner { width: 32px; height: 32px; border: 3px solid #E5E7EB; border-top-color: #2563EB; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 16px auto; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .msg { color: #6B7280; font-size: 14px; }
    .error { color: #DC2626; font-size: 14px; display: none; margin-top: 12px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">Car<span>GPT</span></div>
    <div class="spinner" id="spinner"></div>
    <div class="msg" id="msg">Signing you in...</div>
    <div class="error" id="error"></div>
  </div>
  <script>
    (function() {
      try {
        // Extract tokens from URL hash
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');

        if (!accessToken) {
          // Check query params (some flows use query instead of hash)
          const query = new URLSearchParams(window.location.search);
          const code = query.get('code');
          if (code) {
            // Exchange code for session via Supabase
            document.getElementById('msg').textContent = 'Completing sign in...';
            // Redirect to exchange the code
            fetch('/api/auth', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: 'exchange_code', code: code })
            }).then(r => r.json()).then(data => {
              if (data.session) {
                sessionStorage.setItem('cargpt_session', JSON.stringify({
                  token: data.session.access_token,
                  user: data.user
                }));
                window.location.href = '/';
              } else {
                throw new Error(data.error || 'Failed to exchange code');
              }
            }).catch(err => {
              document.getElementById('error').style.display = 'block';
              document.getElementById('error').textContent = 'Sign in failed. Redirecting...';
              setTimeout(() => window.location.href = '/', 2000);
            });
            return;
          }
          throw new Error('No tokens found');
        }

        // Fetch user info with the access token
        fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'session', token: accessToken })
        }).then(r => r.json()).then(data => {
          if (data.user) {
            sessionStorage.setItem('cargpt_session', JSON.stringify({
              token: accessToken,
              user: data.user
            }));
            document.getElementById('msg').textContent = 'Welcome, ' + data.user.name + '!';
            document.getElementById('spinner').style.display = 'none';
            setTimeout(() => window.location.href = '/', 800);
          } else {
            throw new Error('Could not fetch user');
          }
        }).catch(err => {
          // Still store the token and redirect — session check on main page will handle it
          sessionStorage.setItem('cargpt_session', JSON.stringify({ token: accessToken, user: { email: 'user', name: 'User' } }));
          window.location.href = '/';
        });

      } catch (e) {
        document.getElementById('spinner').style.display = 'none';
        document.getElementById('error').style.display = 'block';
        document.getElementById('error').textContent = 'Something went wrong. Redirecting...';
        setTimeout(() => window.location.href = '/', 2000);
      }
    })();
  </script>
</body>
</html>`);
}

// Client-side API for authentication
export async function signInWithEmail(email: string, password: string) {
  const res = await fetch('/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, mode: 'signin' })
  });
  return res.json();
}

export async function signUpWithEmail(email: string, password: string, name: string) {
  const res = await fetch('/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name, mode: 'signup' })
  });
  return res.json();
}

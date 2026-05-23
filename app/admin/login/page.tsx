import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

async function adminLogin(formData: FormData) {
  'use server'
  const password = formData.get('password') as string
  if (password === process.env.ADMIN_PASSWORD) {
    cookies().set('admin_token', process.env.ADMIN_SECRET!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })
    redirect('/admin')
  }
}

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: '#08080F' }}
    >
      <div
        className="w-full max-w-sm p-10 border"
        style={{
          borderColor: 'rgba(255,255,255,0.1)',
          background: '#0F0F1A',
        }}
      >
        <div className="mb-8">
          <img
            src="/logo.png"
            alt="The Finance Room"
            className="h-7 mb-6"
            style={{ filter: 'brightness(0) invert(1)', opacity: 0.7 }}
          />
          <h1
            className="font-display font-bold text-[22px]"
            style={{ color: '#F2EFE8' }}
          >
            Admin
          </h1>
          <p
            className="text-[13px] mt-1"
            style={{ color: 'rgba(242,239,232,0.4)' }}
          >
            Sign in to manage events
          </p>
        </div>

        {searchParams.error && (
          <div
            className="mb-6 p-3 text-[13px]"
            style={{
              background: 'rgba(255,80,80,0.08)',
              border: '1px solid rgba(255,80,80,0.2)',
              color: 'rgba(255,150,150,0.9)',
            }}
          >
            Incorrect password.
          </div>
        )}

        <form action={adminLogin} className="flex flex-col gap-5">
          <div>
            <label htmlFor="password" className="admin-label">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
              className="admin-input"
              placeholder="Admin password"
            />
          </div>
          <button
            type="submit"
            className="btn btn-amber w-full justify-center"
            style={{  }}
          >
            <span>Sign in</span>
            <span>→</span>
          </button>
        </form>
      </div>
    </div>
  )
}

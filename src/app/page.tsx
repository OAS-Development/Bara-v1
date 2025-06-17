import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">Bara</h1>
        <p className="text-xl mb-8">Private Productivity System</p>
        <p className="text-sm text-gray-600 mb-8">Authorized Access Only</p>
        <Link
          href="/login"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Sign In
        </Link>
      </div>
    </main>
  )
}

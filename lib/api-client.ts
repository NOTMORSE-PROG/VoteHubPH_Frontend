import { getSession } from "next-auth/react"

/**
 * Authenticated fetch wrapper that automatically includes the user ID header
 * for Laravel backend authentication
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const session = await getSession()
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...options.headers,
  }
  
  // Add user ID header for Laravel authentication (works with JWT sessions)
  if (session?.user?.id) {
    headers['X-User-Id'] = session.user.id
  }
  
  return fetch(url, {
    ...options,
    headers,
    credentials: "include",
  })
}


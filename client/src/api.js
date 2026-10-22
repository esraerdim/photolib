const apiUrl = import.meta.env.VITE_API_URL

export async function api(path, options = {}) {
  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  const text = await response.text()
  const body = text ? JSON.parse(text) : null
  if (!response.ok) {
    const error = new Error(body?.message || body?.error || 'Request failed')
    error.status = response.status
    throw error
  }
  return body
}

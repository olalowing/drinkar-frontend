const API_BASE = import.meta.env.VITE_API_URL || ''

async function request(path, options = {}) {
  const isForm = options.body instanceof FormData
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    ...options,
    headers: {
      ...(options.body && !isForm ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`${res.status} ${res.statusText}: ${body}`)
  }
  if (res.status === 204) return null
  return res.json()
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: (path, body) => request(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: 'DELETE' }),
}

export async function uploadImage(file, bucket) {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('bucket', bucket)
  return request('/api/upload', { method: 'POST', body: fd })
}

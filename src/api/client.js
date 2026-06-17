import { appConfig } from '../app/config.js'

export async function apiRequest(route, payload = {}) {
  const baseUrl = import.meta.env.DEV ? '/api' : appConfig.apiBaseUrl

  if (!baseUrl) {
    throw new Error('API base URL is missing')
  }

  const headers = {
    'Content-Type': 'application/json',
  }

  if (appConfig.apiKey) {
    headers['Authorization'] = `Bearer ${appConfig.apiKey}`
  }

  const response = await fetch(baseUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({ route, apiKey: appConfig.apiKey || '', ...payload }),
  })

  const data = await response.json()

  if (!response.ok || data.ok === false) {
    const message = data?.error || 'Request failed'
    throw new Error(message)
  }

  return data
}

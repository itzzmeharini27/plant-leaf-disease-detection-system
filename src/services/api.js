import { auth } from '../firebase.js'

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

async function getAuthHeaders() {
  if (!auth?.currentUser) {
    return {}
  }

  const token = await auth.currentUser.getIdToken()

  return {
    Authorization: `Bearer ${token}`,
  }
}

async function handleResponse(response) {
  if (!response.ok) {
    const data = await response.json().catch(() => ({}))

    throw new Error(
      data.detail || 'Unable to connect to the backend.'
    )
  }

  return response.json()
}

// ================================
// ANALYZE LEAF
// ================================

export async function analyzeLeaf(image) {
  if (!image) {
    throw new Error('Please select a leaf image.')
  }

  const formData = new FormData()

  formData.append(
    'image',
    image,
    image.name || 'leaf.jpg'
  )

  const response = await fetch(
    `${BASE_URL}/api/analyze`,
    {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: formData,
    }
  )

  return handleResponse(response)
}

// ================================
// FORECAST
// ================================

export async function getForecast(params = {}) {
  const query = new URLSearchParams()

  if (params.lat != null) {
    query.set('lat', params.lat)
  }

  if (params.lon != null) {
    query.set('lon', params.lon)
  }

  if (params.crop) {
    query.set('crop', params.crop)
  }

  const queryString = query.toString()

  const response = await fetch(
    `${BASE_URL}/api/forecast${
      queryString ? `?${queryString}` : ''
    }`,
    {
      method: 'GET',
      headers: await getAuthHeaders(),
    }
  )

  return handleResponse(response)
}

// ================================
// EXPERT CHAT
// ================================

export async function sendExpertMessage(
  message,
  history = []
) {
  const response = await fetch(
    `${BASE_URL}/api/chat`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(await getAuthHeaders()),
      },
      body: JSON.stringify({
        message,
        history,
      }),
    }
  )

  return handleResponse(response)
}

// ================================
// HISTORY
// ================================

export async function getHistory() {
  const response = await fetch(
    `${BASE_URL}/api/history`,
    {
      method: 'GET',
      headers: await getAuthHeaders(),
    }
  )

  return handleResponse(response)
}

// ================================
// HEALTH CHECK
// ================================

export async function checkBackendHealth() {
  const response = await fetch(
    `${BASE_URL}/api/health`
  )

  return handleResponse(response)
}
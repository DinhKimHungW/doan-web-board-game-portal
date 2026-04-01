export const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  })
}

export const formatDateTime = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

export const formatScore = (score) => {
  if (score == null) return '0'
  return new Intl.NumberFormat().format(score)
}

export const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export const truncate = (str, len = 100) => {
  if (!str || str.length <= len) return str
  return str.slice(0, len) + '...'
}

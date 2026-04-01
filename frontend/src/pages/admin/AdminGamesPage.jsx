import React, { useState, useEffect } from 'react'
import { adminApi } from '../../services/admin.api'
import Badge from '../../components/common/Badge'
import Modal from '../../components/common/Modal'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const GAME_ICONS = {
  'tic-tac-toe': '⭕', caro4: '⊞', caro5: '⊟', snake: '🐍',
  match3: '💎', memory: '🃏', draw: '🎨',
}

export default function AdminGamesPage() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingGame, setEditingGame] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [actionLoading, setActionLoading] = useState({})

  const loadGames = async () => {
    try {
      const data = await adminApi.getGames()
      setGames(Array.isArray(data) ? data : data?.items || [])
    } catch { setGames([]) }
    setLoading(false)
  }

  useEffect(() => { loadGames() }, [])

  const handleToggleEnabled = async (game) => {
    setActionLoading(p => ({ ...p, [game.id]: true }))
    try {
      await adminApi.updateGame(game.id, { is_enabled: !game.is_enabled })
      setGames(prev => prev.map(g => g.id === game.id ? { ...g, is_enabled: !game.is_enabled } : g))
    } catch { /* ignore */ }
    setActionLoading(p => ({ ...p, [game.id]: false }))
  }

  const openEdit = (game) => {
    setEditingGame(game)
    setEditForm({
      name: game.name,
      description: game.description,
      default_rows: game.default_rows,
      default_cols: game.default_cols,
      default_time_limit: game.default_time_limit || 0,
    })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const updated = await adminApi.updateGame(editingGame.id, {
        name: editForm.name,
        description: editForm.description,
        default_rows: parseInt(editForm.default_rows),
        default_cols: parseInt(editForm.default_cols),
        default_time_limit: parseInt(editForm.default_time_limit),
      })
      setGames(prev => prev.map(g => g.id === editingGame.id ? { ...g, ...editForm, ...updated } : g))
      setEditingGame(null)
    } catch { /* ignore */ }
    setSaving(false)
  }

  if (loading) return <div className="p-8 flex justify-center"><LoadingSpinner size="lg" /></div>

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Games Management</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Enable/disable games and configure settings</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {games.map(game => (
          <div key={game.id} className="card p-5 flex items-center gap-4">
            <div className="text-4xl w-12 text-center">{GAME_ICONS[game.slug] || '🎮'}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-gray-900 dark:text-white">{game.name}</h3>
                <Badge variant={game.is_enabled ? 'success' : 'error'}>
                  {game.is_enabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{game.description}</p>
              <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400">
                <span>Board: {game.default_rows}×{game.default_cols}</span>
                <span>Time: {game.default_time_limit ? `${Math.floor(game.default_time_limit / 60)}m` : 'No limit'}</span>
                <span>Type: <span className="capitalize">{game.type}</span></span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => openEdit(game)}
                className="btn btn-secondary text-sm py-1.5 px-3"
              >
                Edit
              </button>
              <button
                onClick={() => handleToggleEnabled(game)}
                disabled={actionLoading[game.id]}
                className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  game.is_enabled
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200'
                    : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200'
                }`}
              >
                {actionLoading[game.id] ? '...' : (game.is_enabled ? 'Disable' : 'Enable')}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      <Modal isOpen={!!editingGame} onClose={() => setEditingGame(null)} title={`Edit: ${editingGame?.name}`}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
            <input
              type="text"
              value={editForm.name || ''}
              onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
              className="input w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea
              value={editForm.description || ''}
              onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
              rows={2}
              className="input w-full resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rows</label>
              <input
                type="number"
                value={editForm.default_rows || ''}
                onChange={e => setEditForm(f => ({ ...f, default_rows: e.target.value }))}
                className="input w-full"
                min={1} max={50} required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cols</label>
              <input
                type="number"
                value={editForm.default_cols || ''}
                onChange={e => setEditForm(f => ({ ...f, default_cols: e.target.value }))}
                className="input w-full"
                min={1} max={50} required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Time Limit (seconds, 0 = no limit)
            </label>
            <input
              type="number"
              value={editForm.default_time_limit || 0}
              onChange={e => setEditForm(f => ({ ...f, default_time_limit: e.target.value }))}
              className="input w-full"
              min={0}
            />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setEditingGame(null)} className="btn btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn btn-primary disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

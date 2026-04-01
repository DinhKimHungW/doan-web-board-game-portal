import React from 'react'
import Modal from './Modal'
import Button from './Button'

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', danger = false }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>{confirmText}</Button>
      </div>
    </Modal>
  )
}

import { useEffect, useId, useRef } from 'react'

/**
 * @param {{
 *   open: boolean,
 *   title: string,
 *   onClose: () => void,
 *   children: import('react').ReactNode
 * }} props
 */
export default function Dialog({ open, title, onClose, children }) {
  const dialogRef = useRef(null)
  const generatedId = useId()
  const titleId = `dialog-title-${generatedId}`

  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    if (open) {
      if (!el.open) {
        el.showModal()
      }
    } else {
      if (el.open) {
        el.close()
      }
    }
  }, [open])

  // Handle native cancel event (Escape key)
  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    function handleCancel(e) {
      e.preventDefault()
      onClose()
    }
    el.addEventListener('cancel', handleCancel)
    return () => el.removeEventListener('cancel', handleCancel)
  }, [onClose])

  // Handle backdrop click
  function handleClick(e) {
    const el = dialogRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const clickedOutside =
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    if (clickedOutside) {
      onClose()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="dialog"
      aria-labelledby={titleId}
      onClick={handleClick}
    >
      <div className="dialog__inner">
        <div className="dialog__header">
          <h3 id={titleId} className="dialog__title">
            {title}
          </h3>
          <button
            type="button"
            className="button button--ghost dialog__close"
            aria-label="Close dialog"
            onClick={onClose}
          >
            &#x2715;
          </button>
        </div>
        <div className="dialog__body">{children}</div>
      </div>
    </dialog>
  )
}

import React from 'react'
import { X } from 'lucide-react'

export const Modal = ({ title, onClose, children, footer }) => {
    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal__header">
                    <h2 className="modal__title">{title}</h2>
                    <X size={20} className="modal__close" onClick={onClose} />
                </div>

                <div className="modal__body">{children}</div>

                {footer && <div className="modal__footer">{footer}</div>}
            </div>
        </div>
    )
}
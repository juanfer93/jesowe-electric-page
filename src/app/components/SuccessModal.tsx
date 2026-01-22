"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

export default function SuccessModal({ isOpen, onClose }: Props) {
    const [visible, setVisible] = useState(false);

    // Handle animation state
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => setVisible(true), 10);
            return () => clearTimeout(timer);
        } else {
            setVisible(false);
        }
    }, [isOpen]);

    // Handle escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    // Lock body scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen && !visible) return null;

    if (typeof document === "undefined") return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-brand-navy/60 backdrop-blur-sm transition-opacity duration-300 ease-out ${visible ? "opacity-100" : "opacity-0"
                    }`}
                onClick={onClose}
            />

            {/* Modal Content */}
            <div
                className={`relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8 text-center transform transition-all duration-300 ease-out ${visible ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4"
                    }`}
            >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 mb-6">
                    <svg
                        className="h-8 w-8 text-emerald-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2.5"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                        />
                    </svg>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    Message Sent!
                </h3>

                <p className="text-slate-500 mb-8">
                    Thank you for reaching out. We have received your message and will get back to you shortly.
                </p>

                <button
                    type="button"
                    className="w-full rounded-xl bg-brand-navy text-white font-semibold py-3 hover:bg-brand-navy2 transition shadow-lg shadow-brand-navy/20"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>,
        document.body
    );
}

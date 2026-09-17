'use client';

import { useContext } from 'react';
import { ToastContext } from './ToastProvider.jsx';

/**
 * useToast — returns the imperative `toast` function.
 *
 *   const toast = useToast();
 *   toast.success('Settings saved');
 *   toast.error('Delivery failed', { description: 'Retrying automatically.' });
 *   toast.info('Copied', { duration: 2000 });
 *   const id = toast({ tone: 'success', title: 'Reply sent', action: { label: 'Undo', onClick } });
 *   toast.dismiss(id);
 *
 * Must be called from inside a <ToastProvider> (wrap the app once, near root).
 */
export function useToast() {
  const toast = useContext(ToastContext);
  if (!toast) {
    throw new Error('useToast must be called within a <ToastProvider>. Wrap the app (near root) with ToastProvider once.');
  }
  return toast;
}

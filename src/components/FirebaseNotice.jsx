import { AlertTriangle } from 'lucide-react'

export default function FirebaseNotice() {
  return (
    <div className="banner" role="status">
      <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
      <div>
        <strong>Running in local demo mode</strong>
        Firebase isn&apos;t configured yet, so your profile stays on this device. Copy <code>.env.example</code> to{' '}
        <code>.env</code> and add your project credentials to sync data with Firebase.
      </div>
    </div>
  )
}

import ReceiptUploader from '../features/ai/ReceiptUploader.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import { useAuth } from '../features/auth/AuthProvider.jsx'

export default function IaFacturas() {
  const { session } = useAuth()

  return (
    <div className="space-y-6">
      <SectionHeader title="IA para facturas" subtitle="Automatizacion" />
      <ReceiptUploader usuario={session?.email || ''} />
    </div>
  )
}

import { MessageCircle, Mail, Send } from 'lucide-react'

export default function AgentQuickActions({ agent, onSendLeads }) {
  const hasPhone = agent.Phone && agent.Phone !== '--'
  const hasEmail = agent.Email && agent.Email !== 'TBD' && agent.Email !== ''

  function handleMessage() {
    if (!hasPhone) return
    const phone = agent.Phone.replace(/[^+\d]/g, '')
    window.open(`sms:${phone}`, '_blank')
  }

  function handleEmail() {
    if (!hasEmail) return
    const subject = encodeURIComponent(`Quick question about your business, ${agent.Name}`)
    const cc = encodeURIComponent('camjohn816@gmail.com')
    const body = encodeURIComponent(
      `Hey ${agent.Name.split(' ')[0]},\n\nI've got some leads in your area that I need to get to the right people. I'm not a realtor myself — just been doing the research and building lists.\n\nWould you be open to me sending a few your way? You can check them out and let me know if it's something you're interested in.\n\nCameron Johnson\nNMD Solutions`
    )
    window.open(`mailto:${agent.Email}?cc=${cc}&subject=${subject}&body=${body}`, '_blank')
  }

  return (
    <div className="agent-quick-actions">
      <button
        className="btn-secondary"
        onClick={handleMessage}
        disabled={!hasPhone}
        title={hasPhone ? `Message ${agent.Phone}` : 'No phone number'}
      >
        <MessageCircle size={15} />
        Message
      </button>
      <button
        className="btn-secondary"
        onClick={handleEmail}
        disabled={!hasEmail}
        title={hasEmail ? `Email ${agent.Email}` : 'No email'}
      >
        <Mail size={15} />
        Email
      </button>
      <button
        className="btn-secondary btn-secondary--accent"
        onClick={onSendLeads}
      >
        <Send size={15} />
        Send Leads
      </button>
    </div>
  )
}

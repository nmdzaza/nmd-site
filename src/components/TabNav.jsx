export default function TabNav({ tabs, active, onChange }) {
  return (
    <div className="tab-nav">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`tab-nav-btn${active === tab ? ' tab-nav-btn--active' : ''}`}
          onClick={() => onChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}

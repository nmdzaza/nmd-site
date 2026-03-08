export default function Topbar({ onMenuClick, searchQuery, onSearchChange }) {
  return (
    <header className="topbar">
      <button className="topbar-menu" onClick={onMenuClick} aria-label="Toggle menu">
        <span /><span /><span />
      </button>

      <div className="topbar-welcome">
        <span className="topbar-greeting">Welcome back</span>
        <span className="topbar-territory">Your Territory: Phoenix, AZ</span>
      </div>

      <div className="topbar-search">
        <input
          type="text"
          placeholder="Search tools..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="topbar-search-input"
        />
      </div>
    </header>
  )
}

import { Target, Zap, Bot, BarChart3, Shield, Building2, TrendingUp } from 'lucide-react'
import { skills, skillCategories } from '../data/skills'

const iconMap = { Target, Zap, Bot, BarChart3, Shield, Building2, TrendingUp }

export default function Skills() {
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Skills</h1>
        <p className="page-subtitle">{skills.length} Claude CLI skills across {skillCategories.length} categories</p>
      </div>
      {skillCategories.map((cat) => {
        const Icon = iconMap[cat.icon]
        const catSkills = skills.filter((s) => s.category === cat.name)
        if (catSkills.length === 0) return null
        return (
          <section key={cat.name} className="skill-category">
            <div className="skill-category-header">
              {Icon && <Icon size={18} />}
              <h2 className="skill-category-name">{cat.name}</h2>
              <span className="skill-category-count">{catSkills.length}</span>
            </div>
            <div className="skill-grid">
              {catSkills.map((skill) => (
                <div key={skill.name} className="skill-card">
                  <h3 className="skill-card-name">{skill.name}</h3>
                  <p className="skill-card-desc">{skill.description}</p>
                </div>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

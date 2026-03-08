import { useState } from 'react'
import { Target, Zap, Bot, BarChart3, Shield, Building2, TrendingUp, Terminal } from 'lucide-react'
import { skills, skillCategories } from '../data/skills'
import SkillLauncher from '../components/SkillLauncher'

const iconMap = { Target, Zap, Bot, BarChart3, Shield, Building2, TrendingUp }

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function Skills() {
  const [activeSkill, setActiveSkill] = useState(null)

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
                  <div className="skill-card-top">
                    <h3 className="skill-card-name">{skill.name}</h3>
                    <button
                      className="skill-launch-btn"
                      onClick={() => setActiveSkill({
                        slug: slugify(skill.name),
                        name: skill.name,
                        description: skill.description,
                      })}
                    >
                      <Terminal size={14} />
                      Launch
                    </button>
                  </div>
                  <p className="skill-card-desc">{skill.description}</p>
                </div>
              ))}
            </div>
          </section>
        )
      })}

      {activeSkill && (
        <SkillLauncher
          skill={activeSkill}
          onClose={() => setActiveSkill(null)}
        />
      )}
    </div>
  )
}

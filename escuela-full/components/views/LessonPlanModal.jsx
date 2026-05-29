'use client'

import { useState, useEffect } from 'react'

const emptyForm = {
  date:'', subject:'', class:'', time:'', duration:'', roll:'', averageAge:'',
  topic:'', subTopic:'', objectives:'', references:'', teachingAids:'',
  introduction:'', teacherActivities:'', pupilActivities:'', bbPlan:'', remarks:'',
}

export default function LessonPlanModal({ lesson, onClose, onSave }) {
  const [form, setForm]       = useState(emptyForm)
  const [saving, setSaving]   = useState(false)
  const [drafted, setDrafted] = useState(false)
  const [errors, setErrors]   = useState({})

  function getToken() { return localStorage.getItem('token') }

  useEffect(() => {
    if (lesson) {
      setForm({
        ...emptyForm,
        subject:  lesson.subject  || '',
        class:    lesson.class    || '',
        time:     lesson.time     || '',
        duration: lesson.duration || '60 min',
        roll:     lesson.roll     || '38',
        date:     lesson.date     || '',
      })
      setErrors({})
      setDrafted(false)
    }
  }, [lesson])

  if (!lesson) return null

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: false }))
  }

  function validate() {
    const newErrors = {}
    if (!form.topic.trim())   newErrors.topic   = true
    if (!form.subject.trim()) newErrors.subject  = true
    if (!form.class.trim())   newErrors.class    = true
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSaveDraft() {
    console.log('Draft saved:', form)
    setDrafted(true)
    setTimeout(() => setDrafted(false), 2000)
  }

  async function handleSave() {
    if (!validate()) return
    setSaving(true)
    try {
      const res = await fetch('http://127.0.0.1:8000/api/teacher/lesson-plans', {
        method:  'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type':  'application/json',
        },
        body: JSON.stringify({
          date:               form.date     || null,
          subject:            form.subject,
          class_name:         form.class,
          time:               form.time     || null,
          duration:           form.duration || null,
          roll:               form.roll     ? parseInt(form.roll) : null,
          average_age:        form.averageAge   || null,
          topic:              form.topic,
          sub_topic:          form.subTopic     || null,
          objectives:         form.objectives   || null,
          references:         form.references   || null,
          teaching_aids:      form.teachingAids || null,
          introduction:       form.introduction || null,
          teacher_activities: form.teacherActivities || null,
          pupil_activities:   form.pupilActivities   || null,
          bb_plan:            form.bbPlan    || null,
          remarks:            form.remarks   || null,
        })
      })
      if (!res.ok) throw new Error('Failed to save')
      const saved = await res.json()
      onSave?.(saved)
      onClose()
    } catch {
      alert('Failed to save lesson plan. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  function inputStyle(field) {
    return errors[field] ? { borderColor:'#fca5a5', background:'#fff5f5' } : {}
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-5 overflow-y-auto"
      style={{ background:'rgba(0,0,0,0.5)', backdropFilter:'blur(2px)' }}
      onClick={e => { if(e.target===e.currentTarget) onClose() }}>

      <div className="bg-white rounded-2xl w-full max-w-xl overflow-hidden my-4"
        style={{ boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}>

        <div className="px-5 py-4 flex justify-between items-start"
          style={{ background:'linear-gradient(135deg,#064e44,#0a7c6e)' }}>
          <div>
            <h2 className="text-white font-bold">📝 Lesson Preparation</h2>
            <p className="text-xs mt-0.5" style={{ color:'rgba(255,255,255,0.7)' }}>
              {lesson.subject} — {lesson.class} · {lesson.date}
            </p>
          </div>
          <button onClick={onClose}
            className="text-white w-7 h-7 rounded-lg flex items-center justify-center font-bold hover:scale-110 transition-all"
            style={{ background:'rgba(255,255,255,0.2)' }}>✕</button>
        </div>

        {Object.keys(errors).length > 0 && (
          <div className="mx-5 mt-4 px-4 py-3 rounded-xl text-sm font-medium animate-fade-up"
            style={{ background:'#fef2f2', color:'#dc2626', border:'1px solid #fca5a5' }}>
            ⚠️ Please fill in the fields highlighted in red.
          </div>
        )}

        <div className="p-5">
          <div className="grid grid-cols-4 gap-2 mb-4 pb-4" style={{ borderBottom:'1px solid #f0faf8' }}>
            {[
              { label:'Date',        name:'date',       placeholder:'27/05/2025' },
              { label:'Subject *',   name:'subject',    placeholder:'Mathematics' },
              { label:'Class *',     name:'class',      placeholder:'Form 3 North' },
              { label:'Time',        name:'time',       placeholder:'9:00 AM' },
              { label:'Duration',    name:'duration',   placeholder:'60 min' },
              { label:'Roll',        name:'roll',       placeholder:'38' },
              { label:'Average Age', name:'averageAge', placeholder:'16 yrs', className:'col-span-2' },
            ].map(f => (
              <div key={f.name} className={f.className || ''}>
                <label className="form-label">{f.label}</label>
                <input name={f.name} value={form[f.name]} onChange={handleChange}
                  placeholder={f.placeholder} className="form-input" style={inputStyle(f.name)} />
              </div>
            ))}
          </div>

          <div className="mb-3">
            <label className="form-label">Topic *</label>
            <input name="topic" value={form.topic} onChange={handleChange}
              placeholder="e.g. Quadratic equations" className="form-input" style={inputStyle('topic')} />
          </div>
          <div className="mb-3">
            <label className="form-label">Sub topic</label>
            <input name="subTopic" value={form.subTopic} onChange={handleChange}
              placeholder="e.g. Completing the square" className="form-input" />
          </div>
          <div className="mb-3">
            <label className="form-label">Objectives</label>
            <textarea name="objectives" value={form.objectives} onChange={handleChange}
              placeholder={"(i) ...\n(ii) ..."} rows={3} className="form-textarea" />
          </div>
          <div className="mb-3">
            <label className="form-label">Reference / Resources</label>
            <input name="references" value={form.references} onChange={handleChange}
              placeholder="e.g. KLB Mathematics Form 3, pg 45" className="form-input" />
          </div>
          <div className="mb-3">
            <label className="form-label">Learning / Teaching aids</label>
            <input name="teachingAids" value={form.teachingAids} onChange={handleChange}
              placeholder="e.g. Graph boards, calculators" className="form-input" />
          </div>
          <div className="mb-3">
            <label className="form-label">Introduction</label>
            <textarea name="introduction" value={form.introduction} onChange={handleChange}
              placeholder="How will you introduce the lesson?" rows={2} className="form-textarea" />
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="form-label">Teacher's activities</label>
              <textarea name="teacherActivities" value={form.teacherActivities} onChange={handleChange}
                placeholder="What will you do?" rows={4} className="form-textarea" />
            </div>
            <div>
              <label className="form-label">Pupils' activities</label>
              <textarea name="pupilActivities" value={form.pupilActivities} onChange={handleChange}
                placeholder="What will students do?" rows={4} className="form-textarea" />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">B.B. Plan (Blackboard plan)</label>
            <div className="rounded-xl p-3" style={{ border:'2px dashed #e5e7eb', background:'#fafafa' }}>
              <textarea name="bbPlan" value={form.bbPlan} onChange={handleChange}
                placeholder="Describe what will be on the board..." rows={3}
                className="w-full text-sm text-gray-800 bg-transparent focus:outline-none resize-none" />
            </div>
          </div>
          <div>
            <label className="form-label">Remarks</label>
            <input name="remarks" value={form.remarks} onChange={handleChange}
              placeholder="e.g. 3 students absent, cover next lesson" className="form-input" />
          </div>
        </div>

        <div className="px-5 py-4 flex items-center justify-between" style={{ borderTop:'1px solid #f0faf8' }}>
          <div className="text-xs" style={{ color: drafted ? '#059669' : 'transparent' }}>✅ Draft saved</div>
          <div className="flex gap-2">
            <button onClick={onClose} className="btn-secondary">Cancel</button>
            <button onClick={handleSaveDraft} className="btn-secondary"
              style={drafted ? { color:'#059669', borderColor:'#86efac' } : {}}>
              {drafted ? '✅ Draft saved' : '📄 Save draft'}
            </button>
            <button onClick={handleSave} disabled={saving} className="btn-primary">
              {saving
                ? <span className="flex items-center gap-2">
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </span>
                : '💾 Save lesson plan'
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

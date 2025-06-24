"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const allTabs = [
  { key: 'strategy', label: 'Company Strategy' },
  { key: 'financial', label: 'Financial Overview and Returns' },
  { key: 'notetaker', label: 'Notetaker' },
]
const ADMIN_PASSWORD = '12'

export default function AdminPanel() {
  const [userAccess, setUserAccess] = useState<{ [pw: string]: string[] }>({})
  const [newUserPw, setNewUserPw] = useState('')
  const [newUserTabs, setNewUserTabs] = useState<string[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('dashboardUserAccess')
    if (stored) setUserAccess(JSON.parse(stored))
    else setUserAccess({ [ADMIN_PASSWORD]: allTabs.map(t => t.key) })
  }, [])

  const handleAddUser = () => {
    if (!newUserPw.trim() || newUserTabs.length === 0) return
    setUserAccess(prev => {
      const updated = { ...prev, [newUserPw]: newUserTabs }
      localStorage.setItem('dashboardUserAccess', JSON.stringify(updated))
      return updated
    })
    setNewUserPw('')
    setNewUserTabs([])
  }
  const handleRemoveUser = (pw: string) => {
    if (pw === ADMIN_PASSWORD) return
    setUserAccess(prev => {
      const updated = { ...prev }
      delete updated[pw]
      localStorage.setItem('dashboardUserAccess', JSON.stringify(updated))
      return updated
    })
  }

  return (
    <div className="max-w-2xl mx-auto p-6 mt-8 bg-white rounded-lg shadow border">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Admin Panel: User Tab Access</h2>
        <Link href="/">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <input
          type="text"
          value={newUserPw}
          onChange={e => setNewUserPw(e.target.value)}
          placeholder="New user password"
          className="px-2 py-1 border rounded"
        />
        <select
          multiple
          value={newUserTabs}
          onChange={e => setNewUserTabs(Array.from(e.target.selectedOptions, o => o.value))}
          className="px-2 py-1 border rounded"
        >
          {allTabs.map(tab => (
            <option key={tab.key} value={tab.key}>{tab.label}</option>
          ))}
        </select>
        <Button onClick={handleAddUser} className="px-4">Add/Update User</Button>
      </div>
      <div className="text-xs text-gray-600 mb-2">Select tabs for each user password. Admin password always has full access.</div>
      <ul className="space-y-1">
        {Object.entries(userAccess).map(([pw, tabs]) => (
          <li key={pw} className="flex items-center gap-2">
            <span className="font-mono">{pw === ADMIN_PASSWORD ? 'ADMIN' : pw}</span>
            <span className="text-xs">→ {tabs.map(t => allTabs.find(tab => tab.key === t)?.label).join(', ')}</span>
            {pw !== ADMIN_PASSWORD && (
              <button
                className="ml-2 text-xs text-red-500 hover:text-red-700"
                onClick={() => handleRemoveUser(pw)}
                title="Remove user"
              >
                🗑️
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
} 
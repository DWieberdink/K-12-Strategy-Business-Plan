"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

const allTabs = [
  { key: 'strategy', label: 'Company Strategy' },
  { key: 'project-performance', label: 'Project Performance' },
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
    <Card className="max-w-2xl mx-auto mt-8 p-6 shadow-lg rounded-lg bg-white">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <CardTitle className="text-2xl font-bold mb-2 md:mb-0">Admin Panel: User Tab Access</CardTitle>
        <Link href="/" passHref legacyBehavior>
          <a className="inline-block px-4 py-2 border rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium border-gray-300 transition">Back to Dashboard</a>
        </Link>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col md:flex-row md:items-end gap-4 mb-6 p-4 bg-gray-50 rounded-lg border" onSubmit={handleAddUser}>
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1">New user password</label>
            <input type="text" value={newUserPw} onChange={e => setNewUserPw(e.target.value)} className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter password" required />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-1">Select Tabs</label>
            <div className="flex flex-wrap gap-2">
              {allTabs.map(tab => (
                <label key={tab.key} className="flex items-center gap-1 text-sm font-medium bg-blue-50 px-2 py-1 rounded border border-blue-200">
                  <input type="checkbox" checked={newUserTabs.includes(tab.key)} onChange={() => setNewUserTabs(prev => [...prev, tab.key])} />
                  {tab.label}
                </label>
              ))}
            </div>
          </div>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow">Add/Update User</Button>
        </form>
        <div className="mb-4 text-sm text-gray-600">Select tabs for each user password. <span className="font-semibold text-blue-700">Admin password always has full access.</span></div>
        <div className="divide-y divide-gray-200">
          {Object.entries(userAccess).map(([pw, tabs]) => (
            <div key={pw} className="flex flex-col md:flex-row md:items-center md:justify-between py-3">
              <div className="flex items-center gap-3 mb-2 md:mb-0">
                <span className={`font-bold text-lg ${pw === ADMIN_PASSWORD ? 'text-red-600' : 'text-gray-800'}`}>{pw === ADMIN_PASSWORD ? 'ADMIN' : pw}</span>
                <span className="text-gray-400 text-xl">→</span>
                <div className="flex flex-wrap gap-2">
                  {tabs.map(tabKey => (
                    <span key={tabKey} className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold border border-blue-200">{allTabs.find(t => t.key === tabKey)?.label}</span>
                  ))}
                </div>
              </div>
              {pw !== ADMIN_PASSWORD && (
                <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-800 p-2" onClick={() => handleRemoveUser(pw)} title="Delete user">
                  <span role="img" aria-label="Delete">🗑️</span>
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 
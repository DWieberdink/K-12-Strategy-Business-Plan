"use client"

import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const allTabs = [
  { key: "strategy", label: "Company Strategy" },
  { key: "project-performance", label: "Project Performance" },
  { key: "financial", label: "Financial Overview and Returns" },
  { key: "notetaker", label: "Notetaker" },
]

const ADMIN_PASSWORD = "12"

export default function AdminPanel() {
  const [userAccess, setUserAccess] = useState<Record<string, string[]>>({})
  const [newUserPw, setNewUserPw] = useState("")
  const [newUserTabs, setNewUserTabs] = useState<string[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("dashboardUserAccess")
    if (stored) {
      setUserAccess(JSON.parse(stored))
    } else {
      setUserAccess({ [ADMIN_PASSWORD]: allTabs.map((tab) => tab.key) })
    }
  }, [])

  const toggleTabSelection = (tabKey: string, checked: boolean) => {
    setNewUserTabs((current) =>
      checked
        ? Array.from(new Set([...current, tabKey]))
        : current.filter((key) => key !== tabKey),
    )
  }

  const handleAddUser = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const password = newUserPw.trim()
    if (!password || newUserTabs.length === 0) return

    setUserAccess((previous) => {
      const updated = { ...previous, [password]: newUserTabs }
      localStorage.setItem("dashboardUserAccess", JSON.stringify(updated))
      return updated
    })
    setNewUserPw("")
    setNewUserTabs([])
  }

  const handleRemoveUser = (password: string) => {
    if (password === ADMIN_PASSWORD) return
    setUserAccess((previous) => {
      const updated = { ...previous }
      delete updated[password]
      localStorage.setItem("dashboardUserAccess", JSON.stringify(updated))
      return updated
    })
  }

  return (
    <Card className="mx-auto mt-8 max-w-2xl bg-background p-6 shadow-lg">
      <CardHeader className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <CardTitle className="text-2xl font-bold">Admin Panel: User Tab Access</CardTitle>
        <Link
          href="/k12-strategy"
          className="inline-flex items-center rounded-md border border-input bg-muted px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/80"
        >
          Back to Dashboard
        </Link>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleAddUser}
          className="mb-6 flex flex-col gap-4 rounded-lg border bg-muted/50 p-4 md:flex-row md:items-end"
        >
          <div className="flex-1 space-y-2">
            <label className="text-sm font-semibold text-foreground" htmlFor="new-password">
              New user password
            </label>
            <Input
              id="new-password"
              value={newUserPw}
              onChange={(event) => setNewUserPw(event.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          <div className="flex-1 space-y-2">
            <span className="text-sm font-semibold text-foreground">Select tabs</span>
            <div className="flex flex-wrap gap-2">
              {allTabs.map((tab) => {
                const checked = newUserTabs.includes(tab.key)
                return (
                  <label
                    key={tab.key}
                    className="flex items-center gap-2 rounded border border-border bg-background px-3 py-1 text-sm font-medium text-foreground shadow-sm"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(event) => toggleTabSelection(tab.key, event.target.checked)}
                      className="size-4 rounded border-border text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                    {tab.label}
                  </label>
                )
              })}
            </div>
          </div>
          <Button type="submit" className="h-10 px-6">
            Add / Update User
          </Button>
        </form>

        <p className="mb-4 text-sm text-muted-foreground">
          Select tabs for each user password.{" "}
          <span className="font-semibold text-foreground">The admin password always has full access.</span>
        </p>

        <div className="divide-y divide-border">
          {Object.entries(userAccess).map(([password, tabs]) => (
            <div key={password} className="flex flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`text-lg font-bold ${
                    password === ADMIN_PASSWORD ? "text-destructive" : "text-foreground"
                  }`}
                >
                  {password === ADMIN_PASSWORD ? "ADMIN" : password}
                </span>
                <span className="text-muted-foreground">→</span>
                <div className="flex flex-wrap gap-2">
                  {tabs.map((tabKey) => (
                    <span
                      key={tabKey}
                      className="inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground"
                    >
                      {allTabs.find((tab) => tab.key === tabKey)?.label ?? tabKey}
                    </span>
                  ))}
                </div>
              </div>
              {password !== ADMIN_PASSWORD && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleRemoveUser(password)}
                >
                  <span aria-hidden>🗑️</span>
                  <span className="sr-only">Remove user</span>
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

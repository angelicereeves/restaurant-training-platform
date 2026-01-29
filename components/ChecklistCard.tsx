"use client"

import { useEffect, useMemo, useState } from "react"

type Props = {
  storageKey: string
  title: string
  items: string[]
  primaryColor: string
}

export function ChecklistCard({ storageKey, title, items, primaryColor }: Props) {
  const defaultState = useMemo(() => items.map(() => false), [items])

  const [checked, setChecked] = useState<boolean[]>(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (!raw) return items.map(() => false)

      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length === items.length) {
        return parsed.map(Boolean)
      }
      return items.map(() => false)
    } catch {
      return items.map(() => false)
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(checked))
    } catch {
      // ignore
    }
  }, [storageKey, checked])

  useEffect(() => {
    if (checked.length !== items.length) {
      setChecked(items.map(() => false))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length])

  const completedCount = checked.filter(Boolean).length
  const allDone = items.length > 0 && completedCount === items.length

  function toggle(index: number) {
    setChecked((prev) => prev.map((v, i) => (i === index ? !v : v)))
  }

  function reset() {
    setChecked(defaultState)
  }

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-600">
            {completedCount}/{items.length} completed
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span
            className="rounded-full px-3 py-1 text-xs font-semibold"
            style={{
              backgroundColor: allDone ? primaryColor : "#e5e7eb",
              color: allDone ? "white" : "#111827",
            }}
          >
            {allDone ? "Completed" : "In Progress"}
          </span>

          <button
            type="button"
            onClick={reset}
            className="text-xs underline text-gray-600 hover:text-gray-900"
          >
            Reset
          </button>
        </div>
      </div>

      <ul className="mt-4 space-y-3">
        {items.map((label, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={checked[idx] ?? false}
              onChange={() => toggle(idx)}
              className="mt-1 h-4 w-4"
            />
            <span className={checked[idx] ? "text-gray-500 line-through" : "text-gray-900"}>
              {label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

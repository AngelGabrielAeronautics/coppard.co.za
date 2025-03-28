"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function RefreshButton() {
  const router = useRouter()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Refresh the current page
    router.refresh()
    // Reset the refreshing state after a short delay
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  return null
}


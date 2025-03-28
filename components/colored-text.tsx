"use client"

import type React from "react"

interface ColoredTextProps {
  children: React.ReactNode
  className?: string
}

export function ColoredText({ children, className = "" }: ColoredTextProps) {
  // This function processes text to wrap periods at the end of sentences with a span
  const processText = (text: string) => {
    // Replace periods at the end of sentences with a styled span
    return text.replace(/\.(?=\s|$)/g, '<span class="colored-period">.</span>')
  }

  // If children is a string, process it
  if (typeof children === "string") {
    return (
      <span
        className={`italic ${className}`}
        dangerouslySetInnerHTML={{
          __html: processText(children),
        }}
      />
    )
  }

  // If it's not a string, return it as is
  return <span className={className}>{children}</span>
}


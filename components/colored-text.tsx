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

  // If it's not a string, we need to handle React elements differently
  // For the footer and other components, we'll add a class that applies the styling globally
  return (
    <span className={`colored-text-container ${className}`}>
      {children}
      <style jsx global>{`
        .colored-text-container .colored-period,
        .colored-text-container span:not(.colored-period) {
          color: inherit;
        }
        .colored-text-container {
          font-style: italic;
        }
        footer p .colored-period,
        footer .colored-period,
        .colored-text-container .colored-period {
          color: #952617;
        }
      `}</style>
    </span>
  )
}


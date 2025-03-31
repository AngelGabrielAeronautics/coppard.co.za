// Function to generate painting descriptions
export async function generatePaintingDescription(
  imageBase64: string,
  medium: string,
  dimensions: string,
  artistInput?: string,
) {
  try {
    // Call our API route instead of directly using the AI SDK
    const response = await fetch("/api/generate-description", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        imageBase64,
        medium,
        dimensions,
        artistInput,
      }),
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return data.description
  } catch (error) {
    console.error("Error generating painting description:", error)
    throw error
  }
}


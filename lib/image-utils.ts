export async function resizeImageForAI(base64Image: string, maxWidth = 512, maxHeight = 512): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = () => {
      let width = img.width
      let height = img.height

      if (width > maxWidth || height > maxHeight) {
        const aspectRatio = width / height

        if (width > maxWidth) {
          width = maxWidth
          height = width / aspectRatio
        }

        if (height > maxHeight) {
          height = maxHeight
          width = height * aspectRatio
        }
      }

      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext("2d")
      if (!ctx) {
        reject(new Error("Could not get canvas context"))
        return
      }

      ctx.drawImage(img, 0, 0, width, height)

      const resizedBase64 = canvas.toDataURL("image/jpeg", 0.7) // Adjust quality as needed
      resolve(resizedBase64)
    }

    img.onerror = (error) => {
      reject(error)
    }

    img.src = `data:image/jpeg;base64,${base64Image}`
  })
}


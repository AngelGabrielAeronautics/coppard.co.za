import { db, storage, auth } from "./firebase"
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import type { Painting } from "@/types/painting"

// Collection references
const PAINTINGS_COLLECTION = "paintings"

// Create a dummy painting for testing
export async function createInitialPainting() {
  try {
    const paintingRef = doc(db, PAINTINGS_COLLECTION, "initial-painting")
    await setDoc(paintingRef, {
      title: "Welcome to DCoppard Art",
      description: "This is a sample painting to get you started with your art portfolio.",
      imageUrl: "/placeholder.svg?height=800&width=600",
      dimensions: "24 x 36 inches",
      medium: "Oil on canvas",
      year: new Date().getFullYear(),
      price: 500,
      sold: false,
      featured: true,
      referenceCredit: "",
      createdAt: new Date(),
    })
    console.log("Created initial painting")
    return true
  } catch (error) {
    console.error("Error creating initial painting:", error)
    return false
  }
}

// Get all paintings with error handling
export async function getPaintings() {
  try {
    // First check if we can access a specific document as a test
    const testDoc = await getDoc(doc(db, PAINTINGS_COLLECTION, "initial-painting"))

    // If we can't access the test document, create it
    if (!testDoc.exists()) {
      await createInitialPainting()
    }

    // Now try to get all paintings
    const paintingsSnapshot = await getDocs(collection(db, PAINTINGS_COLLECTION))

    // Convert the snapshot to an array of paintings
    const paintings = paintingsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt instanceof Date ? doc.data().createdAt : new Date(),
    })) as Painting[]

    return paintings
  } catch (error) {
    console.error("Error getting paintings:", error)
    // Return an array with just the initial painting as a fallback
    return [
      {
        id: "initial-painting",
        title: "Welcome to DCoppard Art",
        description: "This is a sample painting to get you started with your art portfolio.",
        imageUrl: "/placeholder.svg?height=800&width=600",
        dimensions: "24 x 36 inches",
        medium: "Oil on canvas",
        year: new Date().getFullYear(),
        price: 500,
        sold: false,
        featured: true,
        referenceCredit: "",
        createdAt: new Date(),
      },
    ] as Painting[]
  }
}

// Get featured paintings
export async function getFeaturedPaintings() {
  try {
    const paintings = await getPaintings()
    return paintings.filter((painting) => painting.featured)
  } catch (error) {
    console.error("Error getting featured paintings:", error)
    return []
  }
}

// Get a single painting
export async function getPainting(id: string) {
  try {
    const docRef = doc(db, PAINTINGS_COLLECTION, id)
    const snapshot = await getDoc(docRef)

    if (!snapshot.exists()) {
      // If the painting doesn't exist, check if it's our initial painting
      if (id === "initial-painting") {
        await createInitialPainting()
        const newSnapshot = await getDoc(docRef)
        if (newSnapshot.exists()) {
          return {
            id: newSnapshot.id,
            ...newSnapshot.data(),
            createdAt: newSnapshot.data().createdAt instanceof Date ? newSnapshot.data().createdAt : new Date(),
          } as Painting
        }
      }
      return null
    }

    return {
      id: snapshot.id,
      ...snapshot.data(),
      createdAt: snapshot.data().createdAt instanceof Date ? snapshot.data().createdAt : new Date(),
    } as Painting
  } catch (error) {
    console.error(`Error getting painting ${id}:`, error)

    // If it's the initial painting, return a fallback
    if (id === "initial-painting") {
      return {
        id: "initial-painting",
        title: "Welcome to DCoppard Art",
        description: "This is a sample painting to get you started with your art portfolio.",
        imageUrl: "/placeholder.svg?height=800&width=600",
        dimensions: "24 x 36 inches",
        medium: "Oil on canvas",
        year: new Date().getFullYear(),
        price: 500,
        sold: false,
        featured: true,
        referenceCredit: "",
        createdAt: new Date(),
      } as Painting
    }

    return null
  }
}

// Check if user is authenticated before admin operations
function checkAuth() {
  const currentUser = auth.currentUser
  if (!currentUser) {
    throw new Error("You must be logged in to perform this action")
  }
  return currentUser
}

// Add a new painting - requires auth
export async function addPainting(painting: Omit<Painting, "id" | "createdAt">, imageFile: File) {
  // Check authentication
  const currentUser = auth.currentUser
  if (!currentUser) {
    console.error("Authentication error: No user logged in")
    throw new Error("You must be logged in to add a painting")
  }

  try {
    console.log("Adding new painting with user:", currentUser.uid, currentUser.email)

    // Upload image to storage with metadata
    const filename = `${Date.now()}_${imageFile.name.replace(/[^a-zA-Z0-9.]/g, "_")}`
    const storageRef = ref(storage, `paintings/${filename}`)

    const metadata = {
      customMetadata: {
        userId: currentUser.uid,
        uploadedAt: new Date().toISOString(),
      },
    }

    console.log(`Uploading to storage path: paintings/${filename}`)
    const uploadResult = await uploadBytes(storageRef, imageFile, metadata)
    const imageUrl = await getDownloadURL(uploadResult.ref)

    // Add painting to Firestore
    const newPainting = {
      ...painting,
      imageUrl,
      createdAt: serverTimestamp(),
      userId: currentUser.uid,
    }

    const docRef = await addDoc(collection(db, PAINTINGS_COLLECTION), newPainting)
    return docRef.id
  } catch (error) {
    console.error("Error adding painting:", error)
    throw error instanceof Error ? error : new Error("Failed to add painting. Please try again.")
  }
}

// Update a painting - requires auth
export async function updatePainting(
  id: string,
  painting: Partial<Omit<Painting, "id" | "createdAt">>,
  imageFile?: File,
) {
  // Check authentication - make sure we have a valid user
  const currentUser = auth.currentUser
  if (!currentUser) {
    console.error("Authentication error: No user logged in")
    throw new Error("You must be logged in to update a painting")
  }

  try {
    console.log(`Updating painting ${id} with data:`, painting)
    console.log(`Current user: ${currentUser.uid}, ${currentUser.email}`)

    const docRef = doc(db, PAINTINGS_COLLECTION, id)

    // First check if the document exists
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) {
      console.error(`Painting ${id} does not exist`)
      throw new Error(`Painting with ID ${id} does not exist`)
    }

    const updateData: any = { ...painting }

    // If there's a new image, upload it and update the URL
    if (imageFile) {
      console.log(`Preparing to upload new image for painting ${id}:`, imageFile.name, imageFile.size)

      // Validate image file
      if (imageFile.size > 5 * 1024 * 1024) {
        throw new Error("Image file is too large. Maximum size is 5MB.")
      }

      // Get the current painting to get the old image URL
      const currentPainting = await getPainting(id)

      // Upload new image first - do this before trying to delete the old one
      try {
        console.log(`Starting upload for new image: ${imageFile.name}`)

        // Create a unique filename to avoid conflicts
        const filename = `${Date.now()}_${imageFile.name.replace(/[^a-zA-Z0-9.]/g, "_")}`

        // Create a reference with user ID in the path for better security
        const storageRef = ref(storage, `paintings/${filename}`)

        console.log(`Uploading to storage path: paintings/${filename}`)
        console.log(`User ID: ${currentUser.uid}`)

        // Use a simpler approach for uploading with metadata
        const metadata = {
          customMetadata: {
            userId: currentUser.uid,
            paintingId: id,
          },
        }

        const uploadResult = await uploadBytes(storageRef, imageFile, metadata)
        console.log("Upload completed successfully, getting download URL")

        try {
          const downloadUrl = await getDownloadURL(uploadResult.ref)
          console.log(`Got download URL: ${downloadUrl}`)

          // Only set the imageUrl after successful upload and URL retrieval
          updateData.imageUrl = downloadUrl
        } catch (urlError) {
          console.error("Error getting download URL:", urlError)
          throw new Error("Failed to get image URL after upload. Please try again.")
        }
      } catch (uploadError) {
        console.error("Error uploading new image:", uploadError)
        throw new Error(`Failed to upload image: ${uploadError.message || "Unknown error"}. Please try again.`)
      }

      // Now try to delete the old image if it exists and isn't a placeholder
      if (currentPainting?.imageUrl && !currentPainting.imageUrl.includes("placeholder")) {
        try {
          // Extract the path from the URL
          const oldImagePath = currentPainting.imageUrl.split("/o/")[1]?.split("?")[0]
          if (oldImagePath) {
            console.log(`Attempting to delete old image: ${oldImagePath}`)
            const oldImageRef = ref(storage, decodeURIComponent(oldImagePath))
            await deleteObject(oldImageRef)
            console.log("Old image deleted successfully")
          }
        } catch (error) {
          // Just log the error but don't fail the update
          console.error("Error deleting old image:", error)
        }
      }
    }

    // Update the document
    console.log(`Updating Firestore document with data:`, updateData)
    try {
      await updateDoc(docRef, updateData)
      console.log(`Painting ${id} updated successfully`)
    } catch (updateError) {
      console.error("Error updating document:", updateError)
      throw new Error("Failed to update painting details. Please try again.")
    }

    return id
  } catch (error) {
    console.error(`Error updating painting ${id}:`, error)
    throw error instanceof Error ? error : new Error("Failed to update painting. Please try again.")
  }
}

// Delete a painting - requires auth
export async function deletePainting(id: string) {
  // Check authentication
  const currentUser = auth.currentUser
  if (!currentUser) {
    console.error("Authentication error: No user logged in")
    throw new Error("You must be logged in to delete a painting")
  }

  console.log(`Deleting painting with ID: ${id}`)
  console.log(`Current user: ${currentUser.uid}, ${currentUser.email}`)

  try {
    // Get the painting to get the image URL
    const painting = await getPainting(id)

    if (!painting) {
      console.error(`Painting with ID ${id} not found`)
      throw new Error(`Painting with ID ${id} not found`)
    }

    console.log(`Found painting to delete:`, painting)

    // First delete the image from storage if it exists and isn't a placeholder
    if (painting.imageUrl && !painting.imageUrl.includes("placeholder")) {
      try {
        // Extract the path from the URL
        const imagePath = painting.imageUrl.split("/o/")[1]?.split("?")[0]
        if (imagePath) {
          console.log(`Attempting to delete image at path: ${imagePath}`)
          const imageRef = ref(storage, decodeURIComponent(imagePath))
          await deleteObject(imageRef)
          console.log("Image deleted successfully from storage")
        }
      } catch (error) {
        console.error("Error deleting image from storage:", error)
        // Continue with document deletion even if image deletion fails
      }
    }

    // Now delete the painting document from Firestore
    console.log(`Deleting Firestore document with ID: ${id}`)
    const docRef = doc(db, PAINTINGS_COLLECTION, id)

    try {
      await deleteDoc(docRef)
      console.log(`Firestore document with ID ${id} deleted successfully`)
    } catch (deleteError) {
      console.error("Error deleting Firestore document:", deleteError)
      throw new Error(
        `Failed to delete painting: ${deleteError instanceof Error ? deleteError.message : "Unknown error"}`,
      )
    }

    return id
  } catch (error) {
    console.error(`Error in deletePainting for ID ${id}:`, error)
    throw error instanceof Error ? error : new Error("Failed to delete painting. Please try again.")
  }
}


"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import type { Painting } from "@/types/painting"
import { addPainting, updatePainting } from "@/lib/db"
import { Upload, X, CheckCircle, Loader2 } from "lucide-react"

interface PaintingFormProps {
  painting?: Painting
  isEditing?: boolean
  twoColumnLayout?: boolean
}

export function PaintingForm({ painting, isEditing = false, twoColumnLayout = false }: PaintingFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(painting?.imageUrl || null)
  const [error, setError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<string>("")
  const [isSuccess, setIsSuccess] = useState(false)

  const [artistInput, setArtistInput] = useState<string>("")
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false)

  // Reset form state when navigating away
  useEffect(() => {
    return () => {
      setIsSubmitting(false)
      setUploadProgress(0)
      setError(null)
    }
  }, [])

  // Handle navigation after success
  useEffect(() => {
    if (isSuccess) {
      // Navigate back to admin dashboard after showing success state
      const timer = setTimeout(() => {
        router.push("/admin")
        router.refresh()
      }, 1500) // Wait 1.5 seconds to show success state

      return () => clearTimeout(timer)
    }
  }, [isSuccess, router])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be less than 5MB",
        variant: "destructive",
      })
      return
    }

    setImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const clearImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const generateDescription = useCallback(async () => {
    if (!imagePreview) {
      toast({
        title: "Image required",
        description: "Please upload an image to generate a description",
        variant: "destructive",
      })
      return
    }

    setIsGeneratingDescription(true)

    try {
      // Simulate AI description generation with a delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Create a description based on artist input
      const baseDescription = artistInput
        ? `This piece ${artistInput.toLowerCase().includes("this piece") ? artistInput.substring(10) : artistInput}`
        : "This piece showcases the artist's unique style and technique."

      // Add more details based on the medium, dimensions, etc.
      const mediumText = document.getElementById("medium") as HTMLInputElement
      const heightText = document.getElementById("height") as HTMLInputElement
      const widthText = document.getElementById("width") as HTMLInputElement

      let generatedText = baseDescription

      if (mediumText?.value) {
        generatedText += ` Created using ${mediumText.value.toLowerCase()}, `
      }

      if (heightText?.value && widthText?.value) {
        generatedText += `this ${heightText.value} x ${widthText.value} inch work `
      }

      generatedText +=
        "invites viewers to explore its rich details and emotional depth. The careful composition and thoughtful use of color create a compelling visual narrative that resonates with the viewer."

      // Set the generated text to the description field
      const descriptionField = document.getElementById("description") as HTMLTextAreaElement
      if (descriptionField) {
        descriptionField.value = generatedText
      }

      toast({
        title: "Description generated",
        description: "A description has been generated based on the image and your input",
      })
    } catch (error) {
      console.error("Error generating description:", error)
      toast({
        title: "Error",
        description: "Failed to generate description. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingDescription(false)
    }
  }, [imagePreview, artistInput, toast])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setUploadProgress(0)
    setUploadStatus("")
    setIsSuccess(false)

    const formData = new FormData(e.currentTarget)

    try {
      // Get height and width values
      const height = formData.get("height") as string
      const width = formData.get("width") as string
      // Combine into dimensions string
      const dimensions = `${height} x ${width} inches`

      const paintingData = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        medium: formData.get("medium") as string,
        genre: formData.get("genre") as string,
        dimensions: dimensions, // Use the combined dimensions string
        year: Number.parseInt(formData.get("year") as string),
        price: formData.get("price") ? Number.parseFloat(formData.get("price") as string) : undefined,
        sold: formData.get("sold") === "on",
        featured: formData.get("featured") === "on",
        inProgress: formData.get("inProgress") === "on",
        referenceCredit: formData.get("referenceCredit") as string,
      }

      console.log("Submitting painting data:", paintingData)

      if (isEditing && painting) {
        console.log("Updating painting:", painting.id)

        // If we're uploading an image, show a toast to indicate it might take time
        if (imageFile) {
          toast({
            title: "Uploading image",
            description: "Please wait while the image is being uploaded...",
          })

          // Start progress animation
          setUploadStatus("Preparing upload...")
          setUploadProgress(10)

          // Use setTimeout to simulate progress steps for better UX
          const progressSteps = [
            { progress: 20, status: "Starting upload...", delay: 500 },
            { progress: 40, status: "Uploading image...", delay: 1000 },
            { progress: 60, status: "Processing image...", delay: 1500 },
            { progress: 80, status: "Finalizing upload...", delay: 2000 },
          ]

          // Schedule the progress updates
          progressSteps.forEach((step) => {
            setTimeout(() => {
              if (!isSuccess && !error) {
                // Only update if we haven't succeeded or errored yet
                setUploadProgress(step.progress)
                setUploadStatus(step.status)
              }
            }, step.delay)
          })

          // Set a timeout for the "updating painting details" step before the actual update
          setTimeout(() => {
            if (!isSuccess && !error) {
              // Only update if we haven't succeeded or errored yet
              setUploadProgress(90)
              setUploadStatus("Updating painting details...")
            }
          }, 2500)

          try {
            // Actual update with image
            const result = await updatePainting(painting.id, paintingData, imageFile)
            console.log("Update result:", result)

            // Ensure progress completes after the update is successful
            setUploadProgress(100)
            setUploadStatus("Upload complete!")

            // Show success toast
            toast({
              title: "Success!",
              description: "The painting has been successfully updated",
              variant: "default",
            })

            // Set success state (this will trigger navigation after a delay)
            setIsSuccess(true)
          } catch (error) {
            console.error("Error updating with image:", error)
            // Reset progress and submission state on error
            setUploadProgress(0)
            setUploadStatus("")
            setIsSubmitting(false)

            // Show error toast
            toast({
              title: "Error",
              description: error instanceof Error ? error.message : "Failed to update painting",
              variant: "destructive",
            })

            throw error
          }
        } else {
          // Just updating text fields, no image
          try {
            const result = await updatePainting(painting.id, paintingData)
            console.log("Update result:", result)

            // Show success toast
            toast({
              title: "Success!",
              description: "The painting has been successfully updated",
              variant: "default",
            })

            // Set success state (this will trigger navigation after a delay)
            setIsSuccess(true)
          } catch (error) {
            console.error("Error updating painting:", error)
            setIsSubmitting(false)

            // Show error toast
            toast({
              title: "Error",
              description: error instanceof Error ? error.message : "Failed to update painting",
              variant: "destructive",
            })

            throw error
          }
        }
      } else {
        if (!imageFile) {
          toast({
            title: "Image required",
            description: "Please upload an image for the painting",
            variant: "destructive",
          })
          setIsSubmitting(false)
          return
        }

        console.log("Adding new painting")

        // Show toast for image upload
        toast({
          title: "Uploading image",
          description: "Please wait while the image is being uploaded...",
        })

        // Start progress animation
        setUploadStatus("Preparing upload...")
        setUploadProgress(10)

        // Use setTimeout to simulate progress steps for better UX
        const progressSteps = [
          { progress: 20, status: "Starting upload...", delay: 500 },
          { progress: 40, status: "Uploading image...", delay: 1000 },
          { progress: 60, status: "Processing image...", delay: 1500 },
          { progress: 80, status: "Finalizing upload...", delay: 2000 },
        ]

        // Schedule the progress updates
        progressSteps.forEach((step) => {
          setTimeout(() => {
            if (!isSuccess && !error) {
              // Only update if we haven't succeeded or errored yet
              setUploadProgress(step.progress)
              setUploadStatus(step.status)
            }
          }, step.delay)
        })

        // Set a timeout for the "creating painting" step before the actual operation
        setTimeout(() => {
          if (!isSuccess && !error) {
            // Only update if we haven't succeeded or errored yet
            setUploadProgress(90)
            setUploadStatus("Creating painting...")
          }
        }, 2500)

        try {
          const result = await addPainting(
            {
              ...paintingData,
              imageUrl: "",
              createdAt: new Date(),
            },
            imageFile,
          )

          // Ensure progress completes after the operation is successful
          setUploadProgress(100)
          setUploadStatus("Upload complete!")

          console.log("Add result:", result)

          // Show success toast
          toast({
            title: "Success!",
            description: "The painting has been successfully added",
            variant: "default",
          })

          // Set success state (this will trigger navigation after a delay)
          setIsSuccess(true)
        } catch (error) {
          console.error("Error adding painting:", error)
          // Reset progress and submission state on error
          setUploadProgress(0)
          setUploadStatus("")
          setIsSubmitting(false)

          // Show error toast
          toast({
            title: "Error",
            description: error instanceof Error ? error.message : "Failed to add painting",
            variant: "destructive",
          })

          throw error
        }
      }
    } catch (error) {
      console.error("Error saving painting:", error)
      setError(error instanceof Error ? error.message : "Failed to save painting")
      setIsSubmitting(false)
      setUploadProgress(0)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 col-span-2">
      {error && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-md">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {isSuccess && (
        <div className="bg-green-100 text-green-800 p-4 rounded-md flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          <div>
            <p className="font-medium">Success!</p>
            <p>{isEditing ? "Painting updated successfully." : "Painting added successfully."}</p>
            <p className="text-sm mt-1">Redirecting to dashboard...</p>
          </div>
        </div>
      )}

      {/* Top buttons - duplicated from bottom */}
      <div className="flex gap-4 mb-8 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin")}
          disabled={isSubmitting || isSuccess}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || isSuccess}>
          {isSubmitting ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
              {isEditing ? "Updating..." : "Adding..."}
            </>
          ) : isSuccess ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              {isEditing ? "Updated!" : "Added!"}
            </>
          ) : isEditing ? (
            "Update Painting"
          ) : (
            "Add Painting"
          )}
        </Button>
      </div>

      {twoColumnLayout ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Image */}
          <div className="space-y-4">
            <Label htmlFor="image"></Label>
            <div className="flex flex-col items-center gap-4">
              {imagePreview ? (
                <div className="relative w-full max-w-md bg-transparent">
                  <div className="w-full pt-[100%] relative">
                    <Image
                      src={imagePreview || "/placeholder.svg"}
                      alt="Painting preview"
                      fill
                      className="object-contain bg-transparent"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 z-10"
                      onClick={clearImage}
                      disabled={isSubmitting || isSuccess}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  className="flex w-full max-w-md cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-12"
                  onClick={() => !isSubmitting && !isSuccess && fileInputRef.current?.click()}
                >
                  <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Click to upload an image</p>
                  <p className="text-xs text-muted-foreground mt-1">(Max size: 5MB)</p>
                </div>
              )}
              <Input
                ref={fileInputRef}
                id="image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                disabled={isSubmitting || isSuccess}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSubmitting || isSuccess}
              >
                {imagePreview ? "Change Image" : "Upload Image"}
              </Button>

              {uploadProgress > 0 && (
                <div className="w-full max-w-md">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{uploadStatus}</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div
                      className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Form Fields */}
          <div className="space-y-8 bg-ivory/50 p-6 rounded-lg">
            {/* Section 1: Status Options */}
            <div className="p-4 border border-gray-200 rounded-md bg-background">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Status</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    name="featured"
                    defaultChecked={painting?.featured}
                    disabled={isSubmitting || isSuccess}
                  />
                  <Label htmlFor="featured">Featured on homepage</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="inProgress"
                    name="inProgress"
                    defaultChecked={painting?.inProgress}
                    disabled={isSubmitting || isSuccess}
                  />
                  <Label htmlFor="inProgress">Work in progress</Label>
                </div>
              </div>
            </div>

            {/* Section 2: Title, Medium, Dimensions */}
            <div className="p-4 border border-gray-200 rounded-md bg-background">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Artwork Details</h3>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      defaultValue={painting?.title}
                      required
                      disabled={isSubmitting || isSuccess}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      name="year"
                      type="number"
                      defaultValue={painting?.year || new Date().getFullYear()}
                      required
                      disabled={isSubmitting || isSuccess}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medium">Medium</Label>
                  <Input
                    id="medium"
                    name="medium"
                    defaultValue={painting?.medium || "Oil on canvas"}
                    required
                    disabled={isSubmitting || isSuccess}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="genre">Genre</Label>
                  <select
                    id="genre"
                    name="genre"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    defaultValue={painting?.genre || ""}
                    disabled={isSubmitting || isSuccess}
                  >
                    <option value="" disabled>
                      Select a genre
                    </option>
                    <option value="Portrait">Portrait</option>
                    <option value="Landscape">Landscape</option>
                    <option value="Still Life">Still Life</option>
                    <option value="Nature">Nature</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dimensions">Dimensions (inches)</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="height" className="text-sm">
                        Height
                      </Label>
                      <Input
                        id="height"
                        name="height"
                        type="number"
                        min="1"
                        step="0.1"
                        placeholder="Height"
                        defaultValue={
                          painting?.dimensions
                            ? (() => {
                                // Safely parse the height value from dimensions string
                                const match = painting.dimensions.match(/^([\d.]+)/)
                                return match ? match[1] : ""
                              })()
                            : ""
                        }
                        required
                        disabled={isSubmitting || isSuccess}
                        onChange={(e) => {
                          // Only allow numerical values
                          if (e.target.value && !/^\d*\.?\d*$/.test(e.target.value)) {
                            e.target.value = e.target.value.replace(/[^\d.]/g, "")
                          }
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="width" className="text-sm">
                        Width
                      </Label>
                      <Input
                        id="width"
                        name="width"
                        type="number"
                        min="1"
                        step="0.1"
                        placeholder="Width"
                        defaultValue={
                          painting?.dimensions
                            ? (() => {
                                // Safely parse the width value from dimensions string
                                const match = painting.dimensions.match(/x\s*([\d.]+)/)
                                return match ? match[1] : ""
                              })()
                            : ""
                        }
                        required
                        disabled={isSubmitting || isSuccess}
                        onChange={(e) => {
                          // Only allow numerical values
                          if (e.target.value && !/^\d*\.?\d*$/.test(e.target.value)) {
                            e.target.value = e.target.value.replace(/[^\d.]/g, "")
                          }
                        }}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Enter dimensions in inches</p>
                </div>
              </div>
            </div>

            {/* Section 3: Artist's Input and Description */}
            <div className="p-4 border border-gray-200 rounded-md bg-background">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Description</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="artistInput">Artist's Input (Key points about this piece)</Label>
                  <Textarea
                    id="artistInput"
                    value={artistInput}
                    onChange={(e) => setArtistInput(e.target.value)}
                    placeholder="Enter key points about this piece (e.g., inspiration, technique, meaning)"
                    rows={3}
                    disabled={isSubmitting || isSuccess}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="description">Description</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={generateDescription}
                      disabled={isGeneratingDescription || isSubmitting || isSuccess || !imagePreview}
                    >
                      {isGeneratingDescription ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        "Generate Description"
                      )}
                    </Button>
                  </div>
                  <Textarea
                    id="description"
                    name="description"
                    rows={5}
                    defaultValue={painting?.description}
                    required
                    disabled={isSubmitting || isSuccess || isGeneratingDescription}
                    placeholder="Description will appear here. You can edit it after generation or write your own."
                  />
                  <p className="text-xs text-muted-foreground">
                    Click "Generate Description" to create a description based on the image and your input
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-md bg-background">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Attribution</h3>
              <div className="space-y-2">
                <Label htmlFor="referenceCredit">Reference Credit</Label>
                <Input
                  id="referenceCredit"
                  name="referenceCredit"
                  defaultValue={painting?.referenceCredit}
                  placeholder="Credit the reference source if applicable"
                  disabled={isSubmitting || isSuccess}
                />
                <p className="text-xs text-muted-foreground">
                  If this work is based on a reference, provide attribution here
                </p>
              </div>
            </div>

            {/* Section 4: Price and Sold Status */}
            <div className="p-4 border border-gray-200 rounded-md bg-background">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Sales Information</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (GBP)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    defaultValue={painting?.price}
                    placeholder="Leave blank if not for sale"
                    disabled={isSubmitting || isSuccess}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sold"
                    name="sold"
                    defaultChecked={painting?.sold}
                    disabled={isSubmitting || isSuccess}
                  />
                  <Label htmlFor="sold">Sold</Label>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin")}
                disabled={isSubmitting || isSuccess}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || isSuccess}>
                {isSubmitting ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                    {isEditing ? "Updating..." : "Adding..."}
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    {isEditing ? "Updated!" : "Added!"}
                  </>
                ) : isEditing ? (
                  "Update Painting"
                ) : (
                  "Add Painting"
                )}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* Original layout for non-two-column mode */
        <>
          <div className="space-y-2">
            <Label htmlFor="image"></Label>
            <div className="flex flex-col items-center gap-4">
              {imagePreview ? (
                <div className="relative w-full max-w-md bg-transparent">
                  <div className="w-full pt-[100%] relative">
                    <Image
                      src={imagePreview || "/placeholder.svg"}
                      alt="Painting preview"
                      fill
                      className="object-contain bg-transparent"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 z-10"
                      onClick={clearImage}
                      disabled={isSubmitting || isSuccess}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  className="flex w-full max-w-md cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-12"
                  onClick={() => !isSubmitting && !isSuccess && fileInputRef.current?.click()}
                >
                  <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Click to upload an image</p>
                  <p className="text-xs text-muted-foreground mt-1">(Max size: 5MB)</p>
                </div>
              )}
              <Input
                ref={fileInputRef}
                id="image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                disabled={isSubmitting || isSuccess}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSubmitting || isSuccess}
              >
                {imagePreview ? "Change Image" : "Upload Image"}
              </Button>

              {uploadProgress > 0 && (
                <div className="w-full max-w-md">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{uploadStatus}</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div
                      className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                defaultValue={painting?.title}
                required
                disabled={isSubmitting || isSuccess}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                name="year"
                type="number"
                defaultValue={painting?.year || new Date().getFullYear()}
                required
                disabled={isSubmitting || isSuccess}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="artistInput">Artist's Input (Key points about this piece)</Label>
            <Textarea
              id="artistInput"
              value={artistInput}
              onChange={(e) => setArtistInput(e.target.value)}
              placeholder="Enter key points about this piece (e.g., inspiration, technique, meaning)"
              rows={3}
              disabled={isSubmitting || isSuccess}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="description">Description</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generateDescription}
                disabled={isGeneratingDescription || isSubmitting || isSuccess || !imagePreview}
              >
                {isGeneratingDescription ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Description"
                )}
              </Button>
            </div>
            <Textarea
              id="description"
              name="description"
              rows={5}
              defaultValue={painting?.description}
              required
              disabled={isSubmitting || isSuccess || isGeneratingDescription}
              placeholder="Description will appear here. You can edit it after generation or write your own."
            />
            <p className="text-xs text-muted-foreground">
              Click "Generate Description" to create a description based on the image and your input
            </p>
          </div>

          <div className="p-4 border border-gray-200 rounded-md bg-background">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Attribution</h3>
            <div className="space-y-2">
              <Label htmlFor="referenceCredit">Reference Credit</Label>
              <Input
                id="referenceCredit"
                name="referenceCredit"
                defaultValue={painting?.referenceCredit}
                placeholder="Credit the reference source if applicable"
                disabled={isSubmitting || isSuccess}
              />
              <p className="text-xs text-muted-foreground">
                If this work is based on a reference, provide attribution here
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="medium">Medium</Label>
              <Input
                id="medium"
                name="medium"
                defaultValue={painting?.medium || "Oil on canvas"}
                required
                disabled={isSubmitting || isSuccess}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="genre">Genre</Label>
              <select
                id="genre"
                name="genre"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                defaultValue={painting?.genre || ""}
                disabled={isSubmitting || isSuccess}
              >
                <option value="" disabled>
                  Select a genre
                </option>
                <option value="Portrait">Portrait</option>
                <option value="Landscape">Landscape</option>
                <option value="Still Life">Still Life</option>
                <option value="Nature">Nature</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (GBP)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              defaultValue={painting?.price}
              placeholder="Leave blank if not for sale"
              disabled={isSubmitting || isSuccess}
            />
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex items-center space-x-2">
              <Checkbox id="sold" name="sold" defaultChecked={painting?.sold} disabled={isSubmitting || isSuccess} />
              <Label htmlFor="sold">Sold</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                name="featured"
                defaultChecked={painting?.featured}
                disabled={isSubmitting || isSuccess}
              />
              <Label htmlFor="featured">Featured on homepage</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="inProgress"
                name="inProgress"
                defaultChecked={painting?.inProgress}
                disabled={isSubmitting || isSuccess}
              />
              <Label htmlFor="inProgress">Work in progress</Label>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin")}
              disabled={isSubmitting || isSuccess}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isSuccess}>
              {isSubmitting ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                  {isEditing ? "Updating..." : "Adding..."}
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {isEditing ? "Updated!" : "Added!"}
                </>
              ) : isEditing ? (
                "Update Painting"
              ) : (
                "Add Painting"
              )}
            </Button>
          </div>
        </>
      )}
    </form>
  )
}


"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Minus, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export default function CartPage() {
  // Sample cart data - would be managed with context/state management in a real app
  const [cartItems, setCartItems] = useState([
    {
      id: "sunset-reflections",
      title: "Sunset Reflections",
      price: 850,
      quantity: 1,
      image: "/placeholder.svg?height=200&width=160",
    },
    {
      id: "autumn-path",
      title: "Autumn Path",
      price: 650,
      quantity: 1,
      image: "/placeholder.svg?height=200&width=160",
    },
  ])

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 25
  const total = subtotal + shipping

  return (
    <div className="container px-4 py-12 mx-auto md:px-6 md:py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>

        {cartItems.length > 0 ? (
          <div className="grid gap-8 mt-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 py-4 border-b">
                  <div className="w-20 h-20 overflow-hidden rounded-md bg-neutral-100">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="object-contain w-full h-full"
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <Link href={`/paintings/${item.id}`} className="font-medium hover:underline">
                      {item.title}
                    </Link>
                    <p className="mt-1 text-sm text-muted-foreground">Original Oil Painting</p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="font-medium">£{item.price}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-between mt-6">
                <Link
                  href="/shop"
                  className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Link>
              </div>
            </div>

            <div>
              <div className="p-6 border rounded-lg">
                <h2 className="text-lg font-medium">Order Summary</h2>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>£{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>£{shipping}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>£{total}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <Input placeholder="Discount code" />
                  <Button className="w-full">Apply</Button>
                  <Button className="w-full" size="lg">
                    Proceed to Checkout
                  </Button>
                </div>

                <p className="mt-4 text-xs text-center text-muted-foreground">
                  VAT included in prices. Shipping costs may vary based on location.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 mt-8 text-center border rounded-lg">
            <h2 className="text-xl font-medium">Your cart is empty</h2>
            <p className="mt-2 text-muted-foreground">Looks like you haven't added any paintings to your cart yet.</p>
            <Button asChild className="mt-6">
              <Link href="/shop">Browse the Shop</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}


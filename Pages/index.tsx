// pages/index.tsx
import Head from "next/head";
import { useState } from "react";

const artworks = [
  {
    id: 1,
    title: "Evening Reflection",
    image: "/test/images/art1.jpg",
    price: "$750",
    description: "Oil on canvas, 60cm x 90cm."
  },
  {
    id: 2,
    title: "Whispering Trees",
    image: "/test/images/art2.jpg",
    price: "$560",
    description: "Oil on canvas, 50cm x 70cm."
  },
  {
    id: 3,
    title: "Mountain Haze",
    image: "/test/images/art3.jpg",
    price: "$880",
    description: "Oil on canvas, 80cm x 100cm."
  }
];

export default function Home() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="min-h-screen bg-white text-gray-800 p-6">
      <Head>
        <title>Jane Doe Art</title>
      </Head>

      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">Jane Doe Art</h1>
        <p className="text-lg">Oil Paintings Inspired by Nature</p>
      </header>

      <section className="grid md:grid-cols-3 gap-6">
        {artworks.map((art) => (
          <div key={art.id} className="bg-white rounded-2xl shadow hover:shadow-xl cursor-pointer" onClick={() => setSelected(art)}>
            <img src={art.image} alt={art.title} className="w-full h-60 object-cover rounded-t-2xl" />
            <div className="p-4">
              <h2 className="text-xl font-semibold">{art.title}</h2>
              <p className="text-sm text-gray-600">{art.description}</p>
              <p className="text-md font-medium mt-2">{art.price}</p>
            </div>
          </div>
        ))}
      </section>

      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative">
            <button
              className="absolute top-3 right-3 text-xl"
              onClick={() => setSelected(null)}
            >
              ×
            </button>
            <img src={selected.image} alt={selected.title} className="w-full h-72 object-cover rounded-xl mb-4" />
            <h2 className="text-2xl font-bold mb-2">{selected.title}</h2>
            <p className="text-sm text-gray-700 mb-2">{selected.description}</p>
            <p className="text-lg font-semibold mb-4">{selected.price}</p>
            <button className="w-full bg-black text-white py-2 px-4 rounded-xl">Enquire to Purchase</button>
          </div>
        </div>
      )}
    </div>
  );
}

// tailwind.config.js
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {}
  },
  plugins: []
};

// styles/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  basePath: '/test',
};

module.exports = nextConfig;

/* Local copy instructions:
1. Export static site:
   npm run build && npm run export

2. Output will be in ./out

3. Copy to local Mac path:
   cp -R ./out /Users/dylan/coppard.co.za
   cp -R ./public/test/images /Users/dylan/coppard.co.za/test/images
*/

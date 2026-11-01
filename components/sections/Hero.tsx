'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export function Hero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative text-white min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/Home Background.jpg"
          alt="IIPEC home background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/50" />
      </div>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </div>
      
      <div className="container-custom relative z-10">
        <div className="max-w-3xl">
          <p className="text-accent-light font-semibold text-[1.134rem] uppercase tracking-wider mb-4">
            International Institute of Pastoral Education and Chaplaincy
          </p>
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Potter’s House Command
          </h1>
          <p className={`text-xl text-secondary/90 mb-8 max-w-2xl transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Trained. Commissioned. Deployed.
          </p>
          <p className={`text-lg text-secondary/90 mb-8 max-w-2xl transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            Welcome to the official platform of IIPEC Chaplains, Potter’s House Command - a community of purpose-driven men and women equipped for pastoral service, chaplaincy ministry, and humanitarian outreach across Nigeria and beyond.
          </p>
          <div className={`flex flex-wrap gap-4 transition-all duration-1000 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <Link href="/about" className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-secondary transition-all hover:scale-105 shadow-lg">
              Learn More
            </Link>
            <Link href="/support" className="bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-accent-dark transition-all hover:scale-105 shadow-lg">
              Support Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

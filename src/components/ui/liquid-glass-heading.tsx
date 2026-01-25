"use client"

import * as React from "react"
import { useState, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"

function LiquidGlassFilter() {
  return (
    <svg className="absolute w-0 h-0" aria-hidden="true">
      <defs>
        {/* Liquid distortion filter */}
        <filter id="liquid-text-distort" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.015"
            numOctaves="3"
            seed="3"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="3"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
        
        {/* Glass refraction effect */}
        <filter id="glass-refract" x="-5%" y="-5%" width="110%" height="110%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="blur" />
          <feSpecularLighting
            in="blur"
            surfaceScale="2"
            specularConstant="1"
            specularExponent="20"
            lightingColor="white"
            result="specular"
          >
            <fePointLight x="-5000" y="-10000" z="20000" />
          </feSpecularLighting>
          <feComposite in="specular" in2="SourceGraphic" operator="in" result="specularComposite" />
          <feComposite in="SourceGraphic" in2="specularComposite" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
        </filter>
      </defs>
    </svg>
  )
}

interface LiquidGlassHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
  as?: 'h1' | 'h2' | 'h3'
}

export const LiquidGlassHeading = React.forwardRef<HTMLHeadingElement, LiquidGlassHeadingProps>(
  ({ className, children, as: Tag = 'h1', ...props }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0, scale: 1 })
    const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 })

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return
      
      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      // Calculate rotation based on mouse position relative to center
      const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 15
      const rotateX = -((e.clientY - centerY) / (rect.height / 2)) * 10
      
      // Calculate glow position as percentage
      const glowX = ((e.clientX - rect.left) / rect.width) * 100
      const glowY = ((e.clientY - rect.top) / rect.height) * 100
      
      setTransform({ rotateX, rotateY, scale: 1.02 })
      setGlowPosition({ x: glowX, y: glowY })
    }, [])

    const handleMouseLeave = useCallback(() => {
      setTransform({ rotateX: 0, rotateY: 0, scale: 1 })
      setGlowPosition({ x: 50, y: 50 })
    }, [])

    return (
      <div
        ref={containerRef}
        className="relative inline-block cursor-default"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ perspective: '1000px' }}
      >
        <LiquidGlassFilter />
        
        {/* Dynamic glow that follows cursor */}
        <div
          className="absolute inset-0 pointer-events-none opacity-60 blur-2xl transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glowPosition.x}% ${glowPosition.y}%, rgba(255,255,255,0.4) 0%, transparent 50%)`,
          }}
          aria-hidden="true"
        />
        
        {/* Reflection layer */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(${135 + transform.rotateY}deg, rgba(255,255,255,0.2) 0%, transparent 40%, rgba(255,255,255,0.1) 100%)`,
            transform: `rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)`,
            transition: 'transform 0.1s ease-out',
          }}
          aria-hidden="true"
        />
        
        <Tag
          ref={ref}
          className={cn(
            "relative font-extrabold tracking-tighter transition-transform duration-100 ease-out",
            className
          )}
          style={{
            background: `linear-gradient(${180 + transform.rotateX * 2}deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.75) 30%, rgba(210,220,230,0.55) 60%, rgba(180,190,200,0.35) 100%)`,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            filter: 'url(#liquid-text-distort) url(#glass-refract)',
            textShadow: `
              ${transform.rotateY * 0.3}px ${transform.rotateX * 0.3 + 2}px 4px rgba(0,0,0,0.15),
              ${transform.rotateY * 0.5}px ${transform.rotateX * 0.5 + 4}px 12px rgba(0,0,0,0.1),
              0 0 40px rgba(255,255,255,0.2)
            `,
            transform: `rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale(${transform.scale})`,
            transformStyle: 'preserve-3d',
          }}
          {...props}
        >
          {children}
        </Tag>
        
        {/* Bottom specular highlight */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-overlay"
          style={{
            background: `linear-gradient(${180 - transform.rotateY * 2}deg, transparent 40%, rgba(255,255,255,0.15) 100%)`,
            transform: `rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)`,
            transition: 'transform 0.1s ease-out',
          }}
          aria-hidden="true"
        />
      </div>
    )
  }
)

LiquidGlassHeading.displayName = "LiquidGlassHeading"
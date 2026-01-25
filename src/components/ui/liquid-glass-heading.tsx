"use client"

import * as React from "react"
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
    return (
      <>
        <LiquidGlassFilter />
        <Tag
          ref={ref}
          className={cn(
            "relative font-extrabold tracking-tighter",
            className
          )}
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.7) 30%, rgba(200,210,220,0.5) 60%, rgba(150,160,170,0.3) 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            filter: 'url(#liquid-text-distort) url(#glass-refract)',
            textShadow: '0 2px 4px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.08), 0 0 40px rgba(255,255,255,0.15)',
          }}
          {...props}
        >
          {children}
        </Tag>
      </>
    )
  }
)

LiquidGlassHeading.displayName = "LiquidGlassHeading"
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

function GlassTextFilter() {
  return (
    <svg className="hidden absolute">
      <defs>
        <filter
          id="liquid-glass-text"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.03 0.03"
            numOctaves="2"
            seed="5"
            result="turbulence"
          />
          <feGaussianBlur in="turbulence" stdDeviation="1.5" result="blurredNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurredNoise"
            scale="8"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
          <feGaussianBlur in="displaced" stdDeviation="0.5" result="softDisplaced" />
          <feComposite in="softDisplaced" in2="SourceGraphic" operator="over" />
        </filter>
        
        {/* Glow filter */}
        <filter id="liquid-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0
                    0.5 0.3 0 0 0
                    0.2 0.1 0 0 0
                    0 0 0 1 0"
            result="coloredBlur"
          />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
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
      <div className="relative inline-block">
        <GlassTextFilter />
        
        {/* Background glow layer */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-rose-500/30 via-orange-500/30 to-amber-500/30 blur-3xl animate-pulse"
          aria-hidden="true"
        />
        
        {/* Glass reflection layer */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)',
            filter: 'url(#liquid-glass-text)',
          }}
          aria-hidden="true"
        />
        
        {/* Main text with 3D effect */}
        <Tag
          ref={ref}
          className={cn(
            "relative font-extrabold tracking-tighter",
            "bg-gradient-to-br from-white via-white/90 to-white/70 bg-clip-text text-transparent",
            "drop-shadow-[0_0_30px_rgba(235,133,48,0.5)]",
            "[text-shadow:0_4px_8px_rgba(0,0,0,0.3),0_0_40px_rgba(235,133,48,0.4),0_0_80px_rgba(224,71,36,0.2)]",
            className
          )}
          style={{
            WebkitBackgroundClip: 'text',
            filter: 'url(#liquid-glow)',
          }}
          {...props}
        >
          {/* Inner highlight for 3D depth */}
          <span 
            className="relative"
            style={{
              backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 40%, rgba(200,200,200,0.6) 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {children}
          </span>
        </Tag>
        
        {/* Metallic edge highlight */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-60"
          aria-hidden="true"
        >
          <Tag
            className={cn(
              "font-extrabold tracking-tighter",
              "bg-gradient-to-b from-white/40 via-transparent to-white/20 bg-clip-text text-transparent",
              className
            )}
            style={{
              WebkitBackgroundClip: 'text',
              transform: 'translateY(-1px)',
            }}
            aria-hidden="true"
          >
            {children}
          </Tag>
        </div>
        
        {/* Bottom shadow for 3D depth */}
        <div 
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          <Tag
            className={cn(
              "font-extrabold tracking-tighter text-black/20 blur-[2px]",
              className
            )}
            style={{
              transform: 'translateY(3px) translateX(1px)',
            }}
            aria-hidden="true"
          >
            {children}
          </Tag>
        </div>
      </div>
    )
  }
)

LiquidGlassHeading.displayName = "LiquidGlassHeading"

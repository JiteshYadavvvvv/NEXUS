import React, { useEffect, useRef, useState } from 'react'

const CustomCursor = () => {
  const cursorRef = useRef(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isAutoScrolling, setIsAutoScrolling] = useState(false)

  // Store positions in refs to avoid re-renders during animation loop
  const mousePosition = useRef({ x: 0, y: 0 })
  const cursorPosition = useRef({ x: 0, y: 0 })
  const targetElement = useRef(null)

  // Auto-scroll refs
  const autoScrollOrigin = useRef({ x: 0, y: 0 })
  const autoScrollActive = useRef(false)
  const autoScrollRAF = useRef(null)

  useEffect(() => {
    const cursor = cursorRef.current

    const onPointerMove = (e) => {
      mousePosition.current = { x: e.clientX, y: e.clientY }
    }

    const interactiveSelector = '[link-cursor], a[href], button, input[type="submit"], input[type="button"], [role="button"], .cursor-pointer'

    const onMouseOver = (e) => {
      const target = e.target.closest(interactiveSelector)
      if (target) {
        setIsHovering(true)
        targetElement.current = target

        // Cache metrics once on hover to avoid repeated style/layout reads
        const rect = target.getBoundingClientRect()
        const computedStyle = window.getComputedStyle(target)
        targetElement.current.__metrics = {
          cx: rect.left + rect.width / 2,
          cy: rect.top + rect.height / 2,
          w: rect.width + 8,
          h: rect.height + 8,
          r: computedStyle.borderRadius === '0px' ? '4px' : computedStyle.borderRadius,
        }
      }
    }

    const onMouseOut = (e) => {
      // If the mouse left an interactive element, and that element matches our current target, clear it
      const target = e.target.closest(interactiveSelector)
      if (target && target === targetElement.current) {
        setIsHovering(false)
        targetElement.current = null
      }
    }

    // Middle mouse button auto-scroll
    const onMouseDown = (e) => {
      if (e.button === 1) { // Middle mouse button
        e.preventDefault()
        autoScrollOrigin.current = { x: e.clientX, y: e.clientY }
        autoScrollActive.current = true
        setIsAutoScrolling(true)

        const autoScroll = () => {
          if (!autoScrollActive.current) return

          const deltaY = (mousePosition.current.y - autoScrollOrigin.current.y) * 0.1
          const deltaX = (mousePosition.current.x - autoScrollOrigin.current.x) * 0.1

          // Only scroll if there's meaningful movement
          if (Math.abs(deltaY) > 0.5 || Math.abs(deltaX) > 0.5) {
            window.scrollBy({
              top: deltaY,
              left: deltaX,
              behavior: 'instant'
            })
          }

          autoScrollRAF.current = requestAnimationFrame(autoScroll)
        }

        autoScrollRAF.current = requestAnimationFrame(autoScroll)
      }
    }

    const onMouseUp = (e) => {
      if (e.button === 1) { // Middle mouse button
        autoScrollActive.current = false
        setIsAutoScrolling(false)
        if (autoScrollRAF.current) {
          cancelAnimationFrame(autoScrollRAF.current)
        }
      }
    }

    // Also stop on any click (in case middle button state gets stuck)
    const onContextMenu = (e) => {
      if (autoScrollActive.current) {
        autoScrollActive.current = false
        setIsAutoScrolling(false)
        if (autoScrollRAF.current) {
          cancelAnimationFrame(autoScrollRAF.current)
        }
      }
    }

    // Invalidate cached metrics when layout can change
    const invalidateMetrics = () => {
      if (targetElement.current && targetElement.current.__metrics) {
        targetElement.current.__metrics = null
      }
    }

    // RAF loop with cancellable ref
    const rafIdRef = { current: 0 }

    const applySizeIfChanged = (el, w, h, r) => {
      if (!el) return
      const prevW = el.__lastW || 0
      const prevH = el.__lastH || 0
      const prevR = el.__lastR || ''
      if (Math.abs(prevW - w) > 0.5 || Math.abs(prevH - h) > 0.5 || prevR !== r) {
        el.style.width = `${w}px`
        el.style.height = `${h}px`
        el.style.borderRadius = r
        el.__lastW = w
        el.__lastH = h
        el.__lastR = r
      }
    }

    const animate = () => {
      if (!cursor) return

      let targetX, targetY, targetWidth, targetHeight, targetRadius

      // Check if target element is still in DOM
      if (targetElement.current && !targetElement.current.isConnected) {
        targetElement.current = null
        setIsHovering(false)
      }

      if (targetElement.current) {
        // Use cached metrics when available; otherwise compute once and cache
        let m = targetElement.current.__metrics
        if (!m) {
          const rect = targetElement.current.getBoundingClientRect()
          const computedStyle = window.getComputedStyle(targetElement.current)
          m = {
            cx: rect.left + rect.width / 2,
            cy: rect.top + rect.height / 2,
            w: rect.width + 8,
            h: rect.height + 8,
            r: computedStyle.borderRadius === '0px' ? '4px' : computedStyle.borderRadius,
          }
          targetElement.current.__metrics = m
        }

        targetX = m.cx
        targetY = m.cy
        targetWidth = m.w
        targetHeight = m.h
        targetRadius = m.r
      } else {
        targetX = mousePosition.current.x
        targetY = mousePosition.current.y
        targetWidth = 20
        targetHeight = 20
        targetRadius = '50%'
      }

      // Lerp
      cursorPosition.current.x += (targetX - cursorPosition.current.x) * 0.15
      cursorPosition.current.y += (targetY - cursorPosition.current.y) * 0.15

      // Apply transform (position always updated)
      cursor.style.transform = `translate3d(${cursorPosition.current.x}px, ${cursorPosition.current.y}px, 0) translate(-50%, -50%)`

      // Only update sizing when it changes significantly or on mode switch
      applySizeIfChanged(cursor, targetWidth, targetHeight, targetRadius)

      rafIdRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('pointermove', onPointerMove)
    document.addEventListener('mouseover', onMouseOver)
    document.addEventListener('mouseout', onMouseOut)
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mouseup', onMouseUp)
    document.addEventListener('contextmenu', onContextMenu)
    window.addEventListener('resize', invalidateMetrics, { passive: true })
    window.addEventListener('scroll', invalidateMetrics, { passive: true })

    rafIdRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('mouseover', onMouseOver)
      document.removeEventListener('mouseout', onMouseOut)
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('contextmenu', onContextMenu)
      window.removeEventListener('resize', invalidateMetrics)
      window.removeEventListener('scroll', invalidateMetrics)
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
      if (autoScrollRAF.current) cancelAnimationFrame(autoScrollRAF.current)
    }
  }, [])

  return (
    <>
      <style>{`
        .c-custom-cursor {
          position: fixed;
          top: 0;
          left: 0;
          background-color: #fff;
          mix-blend-mode: difference; /* This makes text visible through the cursor */
          pointer-events: none;
          z-index: 100000;
          will-change: transform, width, height, border-radius;
          transition: width 0.3s ease, height 0.3s ease, border-radius 0.3s ease;
        }
        .c-custom-cursor.auto-scrolling {
          background-color: #888891;
          mix-blend-mode: normal;
          opacity: 0.8;
        }
        .c-custom-cursor.auto-scrolling::before {
          content: '↕';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 14px;
          color: #fff;
        }
        .c-auto-scroll-origin {
          position: fixed;
          width: 24px;
          height: 24px;
          border: 2px solid rgba(136, 136, 145, 0.8);
          border-radius: 50%;
          pointer-events: none;
          z-index: 99999;
          transform: translate(-50%, -50%);
        }
        .c-auto-scroll-origin::before,
        .c-auto-scroll-origin::after {
          content: '';
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
        }
        .c-auto-scroll-origin::before {
          top: -8px;
          border-bottom: 6px solid rgba(136, 136, 145, 0.8);
        }
        .c-auto-scroll-origin::after {
          bottom: -8px;
          border-top: 6px solid rgba(136, 136, 145, 0.8);
        }
        @media (hover: none) or (pointer: coarse) or (max-width: 991px) {
          .c-custom-cursor { display: none; }
          .c-auto-scroll-origin { display: none; }
        }
      `}</style>
      <div
        ref={cursorRef}
        className={`c-custom-cursor ${isAutoScrolling ? 'auto-scrolling' : ''}`}
      />
      {isAutoScrolling && (
        <div
          className="c-auto-scroll-origin"
          style={{
            left: autoScrollOrigin.current.x,
            top: autoScrollOrigin.current.y
          }}
        />
      )}
    </>
  )
}

export default CustomCursor
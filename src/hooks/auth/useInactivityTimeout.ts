import { useEffect, useRef } from 'react'

import { INACTIVITY_TIMEOUT } from '#/constants/session.ts'

const ACTIVITY_EVENTS = [
  'mousemove',
  'mousedown',
  'click',
  'keydown',
  'scroll',
  'touchstart',
  'touchmove',
] as const

interface UseInactivityTimeoutOptions {
  onTimeout: () => void
  timeoutMs?: number
  enabled?: boolean
}

export function useInactivityTimeout({
  onTimeout,
  timeoutMs = INACTIVITY_TIMEOUT,
  enabled = true,
}: UseInactivityTimeoutOptions) {
  const onTimeoutRef = useRef(onTimeout)

  useEffect(() => {
    onTimeoutRef.current = onTimeout
  }, [onTimeout])

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      return
    }

    let timeoutId: number | undefined

    const startTimer = () => {
      window.clearTimeout(timeoutId)
      timeoutId = window.setTimeout(() => {
        onTimeoutRef.current()
      }, timeoutMs)
    }

    startTimer()

    ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, startTimer, { passive: true })
    })

    return () => {
      window.clearTimeout(timeoutId)

      ACTIVITY_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, startTimer)
      })
    }
  }, [enabled, timeoutMs])
}

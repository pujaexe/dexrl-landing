import { useRef, useMemo, useEffect } from "react"

type DebounceOptions = {
    leading?: boolean
    trailing?: boolean
    maxWait?: number
}

type ControlFunctions = {
    cancel: () => void
    flush: () => void
    isPending: () => boolean
}

export type DebouncedState<T extends (...args: any[]) => any> = ((
    ...args: Parameters<T>
) => void) &
    ControlFunctions

export function useDebounceCallback<T extends (...args: any[]) => any>(
    func: T,
    delay = 500,
    options: DebounceOptions = {}
): DebouncedState<T> {
    const timer = useRef<NodeJS.Timeout | null>(null)
    const lastCallTime = useRef<number | null>(null)
    const lastInvokeTime = useRef<number | null>(null)
    const lastArgs = useRef<any[]>([])
    const pending = useRef(false)

    const { leading = false, trailing = true, maxWait } = options

    const debounced = useMemo(() => {
        const invoke = () => {
            lastInvokeTime.current = Date.now()
            pending.current = false
            return func(...lastArgs.current)
        }

        const debouncedFn: DebouncedState<T> = (...args: Parameters<T>) => {
            const now = Date.now()
            lastArgs.current = args
            pending.current = true

            if (!lastCallTime.current) {
                lastCallTime.current = now
            }

            const timeSinceLastInvoke = lastInvokeTime.current
                ? now - lastInvokeTime.current
                : null

            const shouldInvoke =
                (leading && !lastInvokeTime.current) ||
                (maxWait && timeSinceLastInvoke !== null && timeSinceLastInvoke >= maxWait)

            if (shouldInvoke) {
                if (timer.current) clearTimeout(timer.current)
                lastCallTime.current = now
                return invoke()
            }

            if (timer.current) clearTimeout(timer.current)

            timer.current = setTimeout(() => {
                lastCallTime.current = null
                if (trailing) invoke()
            }, delay)
        }

        debouncedFn.cancel = () => {
            if (timer.current) clearTimeout(timer.current)
            timer.current = null
            pending.current = false
            lastCallTime.current = null
            lastInvokeTime.current = null
        }

        debouncedFn.flush = () => {
            if (pending.current) {
                if (timer.current) clearTimeout(timer.current)
                return func(...lastArgs.current)
            }
        }

        debouncedFn.isPending = () => pending.current

        return debouncedFn
    }, [func, delay, leading, trailing, maxWait])

    useEffect(() => {
        return () => {
            if (timer.current) clearTimeout(timer.current)
        }
    }, [])

    return debounced
}

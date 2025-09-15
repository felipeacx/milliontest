export interface PerformanceMetrics {
  name: string
  duration: number
  timestamp: number
  details?: any
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = []
  private activeTimers: Map<string, number> = new Map()

  startTiming(name: string): void {
    this.activeTimers.set(name, performance.now())
  }

  endTiming(name: string, details?: any): PerformanceMetrics | null {
    const startTime = this.activeTimers.get(name)
    if (!startTime) {
      return null
    }

    const duration = performance.now() - startTime
    const metric: PerformanceMetrics = {
      name,
      duration,
      timestamp: Date.now(),
      details,
    }

    this.metrics.push(metric)
    this.activeTimers.delete(name)

    return metric
  }

  async measure<T>(name: string, fn: () => Promise<T>, details?: any): Promise<T> {
    this.startTiming(name)
    try {
      const result = await fn()
      this.endTiming(name, details)
      return result
    } catch (error) {
      this.endTiming(name, {
        ...details,
        error: error instanceof Error ? error.message : "Unknown error",
      })
      throw error
    }
  }

  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics]
  }

  // Get metrics for a specific operation
  getMetricsFor(name: string): PerformanceMetrics[] {
    return this.metrics.filter((metric) => metric.name === name)
  }

  // Get average duration for an operation
  getAverageDuration(name: string): number {
    const operationMetrics = this.getMetricsFor(name)
    if (operationMetrics.length === 0) return 0

    const totalDuration = operationMetrics.reduce((sum, metric) => sum + metric.duration, 0)
    return totalDuration / operationMetrics.length
  }

  // Clear metrics (useful for testing or memory management)
  clearMetrics(): void {
    this.metrics = []
    this.activeTimers.clear()
  }

  // Generate performance report
  generateReport(): string {
    const operationNames = this.metrics.map((m) => m.name)
    const operations = operationNames.filter(
      (name, index) => operationNames.indexOf(name) === index
    )

    let report = "Performance Report\n"
    report += "==================\n\n"

    operations.forEach((operation) => {
      const metrics = this.getMetricsFor(operation)
      const avgDuration = this.getAverageDuration(operation)
      const minDuration = Math.min(...metrics.map((m) => m.duration))
      const maxDuration = Math.max(...metrics.map((m) => m.duration))

      report += `${operation}:\n`
      report += `  Executions: ${metrics.length}\n`
      report += `  Average: ${avgDuration.toFixed(2)}ms\n`
      report += `  Min: ${minDuration.toFixed(2)}ms\n`
      report += `  Max: ${maxDuration.toFixed(2)}ms\n\n`
    })

    return report
  }
}

export const performanceMonitor = new PerformanceMonitor()

export const monitorWebVitals = () => {
  if (typeof window !== "undefined" && "performance" in window) {
    import("web-vitals")
      .then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(() => {})
        getFID(() => {})
        getFCP(() => {})
        getLCP(() => {})
        getTTFB(() => {})
      })
      .catch(() => {})
  }

  if (typeof window !== "undefined" && "performance" in window && performance.getEntriesByType) {
    const navEntries = performance.getEntriesByType("navigation")
    if (navEntries.length > 0) {
      const navTiming = navEntries[0] as PerformanceNavigationTiming
      // Navigation timing data available
    }
  }
}

// API call performance decorator
export const withAPIPerformanceMonitoring = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  operationName: string
): T => {
  return (async (...args: Parameters<T>) => {
    return performanceMonitor.measure(`api_${operationName}`, () => fn(...args), {
      args: args.length,
    })
  }) as T
}

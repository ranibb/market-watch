export function useFormatter() {
  const formatCurrency = (value: number | undefined | null) => {
    if (value == null) {
      return 'N/A'
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(value)
  }

  return { formatCurrency }
}

import { useMemo } from 'react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  siblingCount?: number
}
const range = (start: number, end: number) => {
  const length = end - start + 1

  return Array.from({ length }, (_, idx) => idx + start)
}
export const usePagination = ({ currentPage, totalPages, siblingCount = 1 }: PaginationProps) => {
  const paginationRange = useMemo(() => {
    const totalPageNumbers = siblingCount + 5
    if (totalPageNumbers >= totalPages) return range(1, totalPages)

    const leftSiblingIdx = Math.max(currentPage - siblingCount, 1)
    const rightSiblingIdx = Math.min(currentPage + siblingCount, totalPages)

    const shouldShowLeftDots = leftSiblingIdx > 2
    const shouldShowRightDots = rightSiblingIdx < totalPages - 2

    const firstPageIdx = 1
    const lastPageIdx = totalPages

    if (shouldShowRightDots && !shouldShowLeftDots) {
      const leftItemCount = 3 + 2 * siblingCount
      const leftRange = range(1, leftItemCount)

      return [...leftRange, -1, totalPages]
    }

    if (!shouldShowRightDots && shouldShowLeftDots) {
      const rightItemCount = 3 + 2 * siblingCount
      const rightRange = range(totalPages - rightItemCount + 1, totalPages)

      return [firstPageIdx, -1, ...rightRange]
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIdx, rightSiblingIdx)
      return [firstPageIdx, -1, ...middleRange, -1, lastPageIdx]
    }
  }, [currentPage, totalPages, siblingCount])

  return paginationRange
}

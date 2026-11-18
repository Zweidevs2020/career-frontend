// Phone layout shared by every My Choices section: each course / option is shown as an
// aligned card instead of a wide, side-scrolling table row. Desktop and tablet keep the tables.
import React, { useEffect, useState } from "react"
import { BankOutlined, EnvironmentOutlined } from "@ant-design/icons"

const MOBILE_QUERY = "(max-width: 640px)"

// True on phone-sized screens.
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && Boolean(window.matchMedia?.(MOBILE_QUERY).matches),
  )
  useEffect(() => {
    const query = window.matchMedia?.(MOBILE_QUERY)
    if (!query) return undefined
    const update = () => setIsMobile(query.matches)
    update()
    if (query.addEventListener) {
      query.addEventListener("change", update)
      return () => query.removeEventListener("change", update)
    }
    query.addListener(update)
    return () => query.removeListener(update)
  }, [])
  return isMobile
}

// Rank shown at the top of a saved choice: "#3" or "Unsorted", plus "Recently added".
export const MobileRank = ({ unsorted, number, recent }) => (
  <>
    {unsorted ? (
      <span className="l8-mcard-rank l8-mcard-rank-unsorted">Unsorted</span>
    ) : (
      <span className="l8-mcard-rank">#{number}</span>
    )}
    {recent && <span className="l8-mcard-recent">Recently added</span>}
  </>
)

/**
 * Row 1: rank / code on the left, points on the right
 * Row 2: title
 * Row 3: college / university / provider
 * Row 4: county · region / location
 * Row 5: extra details (level, duration, fee...)
 * Row 6: course info link
 * Pass `points` only for sections that have points (null shows "—").
 */
export const MobileCourseCard = ({ rank, code, points, title, institution, location, details = [], link, children }) => {
  const hasPoints = points !== undefined
  return (
    <div className="l8-mcard">
      {(rank || code || hasPoints) && (
        <div className="l8-mcard-meta">
          <span className="l8-mcard-meta-start">
            {rank}
            {code && <span className="l8-mcard-code">{code}</span>}
          </span>
          {hasPoints && (
            <span className="l8-mcard-points">
              {points ?? "—"}
              <small>pts</small>
            </span>
          )}
        </div>
      )}
      {title && <div className="l8-mcard-title">{title}</div>}
      {children}
      {institution && (
        <div className="l8-mcard-row">
          <BankOutlined className="l8-mcard-icon" />
          <span>{institution}</span>
        </div>
      )}
      {location && (
        <div className="l8-mcard-row">
          <EnvironmentOutlined className="l8-mcard-icon" />
          <span>{location}</span>
        </div>
      )}
      {details.length > 0 && (
        <div className="l8-mcard-details">
          {details.map((detail) => (
            <span key={detail.label} className="l8-mcard-chip">
              <em>{detail.label}</em>
              {detail.value}
            </span>
          ))}
        </div>
      )}
      {link && <div className="l8-mcard-link">{link}</div>}
    </div>
  )
}

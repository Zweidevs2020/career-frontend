"use client"

import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { LoadingOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons"
import { getApiWithAuth } from "../../utils/api"

const PaymentVerification = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const queryParams = new URLSearchParams(location.search)
  const sessionId = queryParams.get("session_id")

  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)

  const verifyPayment = async () => {
    if (!sessionId) {
      setStatus("No session_id found in URL")
      setIsError(true)
      setLoading(false)
      return
    }

    try {
      const response = await getApiWithAuth(`user/billing/session-status/?session_id=${sessionId}`)

      console.log("Full API Response:", response)
      const data = response?.data ? response.data : response
      console.log("Parsed Data:", data)

      if (data.status === 200) {
        setStatus("Payment verified successfully!")
        setIsSuccess(true)
        setTimeout(() => {
          navigate("/dashboard")
        }, 2000)
      } else {
        setStatus(`Payment verification failed. Status: ${data.status || "unknown"}`)
        setIsError(true)
      }
    } catch (err) {
      console.error("Payment verification error:", err)
      setStatus("Error verifying payment. Please try again.")
      setIsError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    verifyPayment()
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {loading ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <LoadingOutlined className="text-5xl text-blue-600" spin />
              <div className="absolute inset-0 rounded-full border-2 border-blue-100"></div>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-800">Verifying Payment</h2>
              <p className="text-gray-600">Please wait while we confirm your transaction...</p>
              <div className="flex justify-center space-x-1 mt-4">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            {isSuccess && <CheckCircleOutlined className="text-6xl text-green-500 animate-pulse" />}
            {isError && <CloseCircleOutlined className="text-6xl text-red-500" />}
            <div className="space-y-2">
              <h2
                className={`text-xl font-semibold ${
                  isSuccess ? "text-green-700" : isError ? "text-red-700" : "text-gray-800"
                }`}
              >
                {status}
              </h2>
              {isSuccess && <p className="text-gray-600">Redirecting to your dashboard...</p>}
              {isError && (
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PaymentVerification

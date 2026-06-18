import React, { useState, useEffect } from "react";
import { Modal, Spin, message } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { getApiWithoutAuth } from "../../../utils/api";

const DemoVideoModal = ({ open, onClose, apiUrl }) => {
  const [loading, setLoading] = useState(false);
  const [videoData, setVideoData] = useState(null);

  useEffect(() => {
    if (open && apiUrl) {
      fetchVideoData();
    }
  }, [open, apiUrl]);

  const fetchVideoData = async () => {
    setLoading(true);
    try {
      const response = await getApiWithoutAuth(apiUrl);
      if (response?.data && !response.status) {
        setVideoData(response.data);
      } else if (response?.status === 200 && response?.data) {
        setVideoData(response.data);
      } else {
        message.error("Failed to load demo video.");
      }
    } catch (error) {
      message.error("An error occurred while fetching the demo video.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
          .demo-video-modal-custom .ant-modal-close {
            display: flex !important;
            align-items: center;
            justify-content: center;
            background-color: #ff4d4f !important;
            color: #ffffff !important;
            border-radius: 50% !important;
            width: 32px !important;
            height: 32px !important;
            
            box-shadow: 0 4px 12px rgba(0,0,0,0.25) !important;
            transition: all 0.3s ease !important;
            z-index: 1010 !important;
          }

          .demo-video-modal-custom .ant-modal-close:hover {
            background-color: #d9363e !important;
            transform: scale(1.1) !important;
          }

          .demo-video-modal-custom .ant-modal-close-icon {
            display: flex !important;
            color: #ffffff !important;
            font-size: 16px !important;
            font-weight: bold !important;
          }
          
          /* Ensure the close button is not hidden by other styles */
          .demo-video-modal-custom span.anticon.anticon-close.ant-modal-close-icon {
            display: flex !important;
          }
        `}
      </style>
      <Modal
        className="demo-video-modal-custom"
        open={open}
        onCancel={onClose}
        footer={null}
        destroyOnClose
        width={900}
        closable={true}
        maskClosable={true}
        closeIcon={<CloseOutlined />}
        title={
          <div style={{ color: "#1476B7", fontWeight: "bold", fontSize: "18px" }}>
            {videoData?.title || "Demo Video"}
          </div>
        }
        centered
        bodyStyle={{ padding: "10px", background: "#f8fafc" }}
        maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
      >
        <div
          style={{
            position: "relative",
            paddingTop: "56.25%",
            background: "#000",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          {loading ? (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Spin size="large" />
            </div>
          ) : videoData?.embed_url ? (
            <iframe
              src={videoData.embed_url}
              title={videoData.title}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: 0,
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#fff",
              }}
            >
              {!loading && "No video available"}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default DemoVideoModal;

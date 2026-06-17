import React, { useState, useEffect } from "react";
import { Modal, Spin, message } from "antd";
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
      // getApiWithoutAuth returns { data: res.data } on success, 
      // and err.response (which has a status) on error.
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
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      width={900}
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
  );
};

export default DemoVideoModal;

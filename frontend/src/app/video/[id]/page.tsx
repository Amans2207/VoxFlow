"use client";

import React, { useRef, useState, useEffect } from "react";
import styles from "./video.module.css";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createClient } from '@/utils/supabase/client';

export default function VideoPlayer() {
  const params = useParams();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [videoUrl, setVideoUrl] = useState<string>("");
  const [job, setJob] = useState<any>(null);

  useEffect(() => {
    const fetchJobAndUrl = async () => {
      const supabase = createClient();
      
      // 1. Fetch Job details to get dubbingId and langCode
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', params.id)
        .single();
      
      if (jobData) {
        setJob(jobData);
        // 2. Set Video URL to our proxy
        const dubId = jobData.dubbing_id || jobData.id;
        const lang = jobData.target_lang || 'hi';
        setVideoUrl(`/api/video/download?dubbingId=${dubId}&langCode=${lang}`);
      }
    };
    fetchJobAndUrl();
  }, [params.id]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch(error => {
              console.log("Playback interrupted:", error);
            });
        }
      }
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <Link href="/dashboard" className={styles.backLink}>
          ← Back to Dashboard
        </Link>
        <h1>{job?.filename || "Video Preview"}</h1>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.playerContainer}>
          <div className={`glass-panel ${styles.videoWrapper}`}>
            <video
              ref={videoRef}
              key={videoUrl}
              className={styles.videoElement}
              controls
              autoPlay
              onClick={togglePlay}
            >
              {videoUrl && <source src={videoUrl} type="video/mp4" />}
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        <div className={styles.sidebar}>
          <div className={`glass-panel ${styles.detailsCard}`}>
            <h3>Job Details</h3>
            <ul className={styles.detailsList}>
              <li>
                <span>Filename:</span>
                <strong>{job?.filename || "Scanning..."}</strong>
              </li>
              <li>
                <span>Status:</span>
                <span className={styles.statusSuccess}>{job?.status || "Processing"}</span>
              </li>
              <li>
                <span>Target Lang:</span>
                <strong>{job?.target_lang || "Default"}</strong>
              </li>
            </ul>

            <div className={styles.actions}>
              <button 
                className="btn-primary" 
                style={{ width: "100%" }}
                onClick={() => {
                  if (job) {
                    const dubId = job.dubbing_id || job.id;
                    const lang = job.target_lang || 'hi';
                    window.open(`/api/video/download?dubbingId=${dubId}&langCode=${lang}`, '_blank');
                  }
                }}
              >
                Download Video
              </button>
              <button className="btn-accent" style={{ width: "100%", marginTop: "12px" }}>
                Download Subtitles (.srt)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

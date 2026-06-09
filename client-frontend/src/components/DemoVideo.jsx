import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useState } from "react";

const DemoVideo = () => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [videoError, setVideoError] = useState(false);

  const isInView = useInView(containerRef, {
    amount: 0.6,
  });

  useEffect(() => {
    if (!videoRef.current) return;

    if (isInView) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isInView]);

  if (videoError) return null;

  return (

    <section className="relative overflow-hidden py-32 px-6">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-300/20 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-16 text-center">
          <span className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-medium text-purple-700">
            🎬 Product Demo
          </span>

          <h2 className="mt-6 text-4xl font-bold text-gray-900 md:text-5xl">
            See <span className="text-purple-600">IssueFlow</span> in Action
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500">
            Watch how teams manage projects, collaborate in real-time,
            and accelerate workflows using AI-powered features.
          </p>
        </div>

        {/* Video Card */}
        <div className="relative mx-auto max-w-5xl">
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="
              overflow-hidden
              rounded-[32px]
              border
              border-purple-100
              bg-white
              shadow-[0_20px_60px_rgba(124,58,237,0.15)]
            "
          >
            {/* Browser Header */}
            <div className="flex items-center gap-2 border-b border-purple-100 bg-purple-50/50 px-5 py-3">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />

            </div>

            {/* Video */}
            <div className="aspect-video">
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                muted
                playsInline
                preload="metadata"
                poster="/demo-thumbnail.png"
                 onError={() => setVideoError(true)}
              >
                <source src="/demo.mp4" type="video/mp4" />
              </video>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DemoVideo;
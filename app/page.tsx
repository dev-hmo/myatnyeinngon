"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export default function UltimateValentine() {
  const [introDone, setIntroDone] = useState(false);
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [openEnvelope, setOpenEnvelope] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const narrationRef = useRef<SpeechSynthesisUtterance | null>(null);

  // CHANGE THIS PASSWORD
  const SECRET_PASSWORD = "452020";

  const startDate = new Date("2020-05-04");
  const today = new Date();
  const daysTogether = Math.floor(
    (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  useEffect(() => {
    const timer = setTimeout(() => setIntroDone(true), 3500);
    return () => clearTimeout(timer);
  }, []);

  const handleUnlock = () => {
    if (password.trim() === SECRET_PASSWORD) {
      setUnlocked(true);
      audioRef.current
        ?.play()
        .then(() => {
          if (audioRef.current) audioRef.current.volume = 0;

          // cinematic fade in
          let vol = 0;
          const fade = setInterval(() => {
            if (!audioRef.current) return;
            vol += 0.05;
            audioRef.current.volume = Math.min(vol, 1);
            if (vol >= 1) clearInterval(fade);
          }, 200);
        })
        .catch(() => {});
    }
  };

  const speakLetter = () => {
    const text = `Pu Tue... Every love story is beautiful, but ours is my favorite.
    ${daysTogether} days ago, you became my everything.
    If I could choose again in every lifetime — I would still choose you.`;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.1;

    narrationRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-pink-200 via-rose-100 to-fuchsia-200 flex items-center justify-center px-4">
      {/* cinematic blobs */}
      <div className="absolute w-[500px] h-[500px] bg-pink-300/40 blur-3xl rounded-full -top-32 -left-32" />
      <div className="absolute w-[400px] h-[400px] bg-rose-300/40 blur-3xl rounded-full bottom-0 right-0" />

      <FloatingHearts />
      <MeteorShower />

      <audio ref={audioRef} src="/blue.mp3" loop />

      {/* INTRO */}
      <AnimatePresence>
        {!introDone && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 3 }}
            className="absolute inset-0 bg-black flex items-center justify-center z-50"
          >
            <motion.h1
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 2 }}
              className="text-3xl md:text-5xl font-light tracking-wide text-white text-center"
            >
              Pu Tue... this is for you ❤️
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>

      {introDone && (
        <>
          {/* LOCK */}
          {!unlocked && (
            <Card className="w-full max-w-sm z-20 backdrop-blur-xl bg-white/90">
              <CardContent className="p-6 space-y-4 text-center">
                <h2 className="text-xl font-semibold">
                  🔐 Only Pu Tue Can Enter
                </h2>

                <input
                  type="password"
                  placeholder="Our secret date"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
                  className="w-full border rounded-md p-3 text-[16px]"
                />

                <Button onClick={handleUnlock} className="w-full">
                  Enter ❤️
                </Button>
              </CardContent>
            </Card>
          )}

          {/* ENVELOPE */}
          {unlocked && !openEnvelope && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="cursor-pointer z-20"
              onClick={() => setOpenEnvelope(true)}
            >
              <motion.div
                whileTap={{ scale: 0.96 }}
                className="bg-white w-[300px] md:w-[360px] h-[200px] rounded-3xl shadow-2xl flex items-center justify-center text-center px-6 text-lg font-medium"
              >
                💌 Tap to Open Your Letter
              </motion.div>
            </motion.div>
          )}

          {/* MAIN EXPERIENCE */}
          {openEnvelope && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
              className="max-w-3xl w-full z-20 space-y-8 pb-20"
            >
              <Card className="shadow-xl bg-white/95 backdrop-blur-xl">
                <CardContent className="p-6 md:p-10 text-center space-y-4">
                  <h1 className="text-2xl md:text-3xl font-bold text-pink-600">
                    My Dearest Pu Tue 💕
                  </h1>

                  <TypewriterText
                    text={`Every love story is beautiful… but ours is my favorite.

${daysTogether} days ago, you walked into my life and quietly became my everything.

You are the smile I never want to lose, the peace I never knew I needed, and the dream I want to live every day.

If I could choose again, in every lifetime — I would still choose you.

Forever yours,
Ko Ko ❤️`}
                  />

                  <Button onClick={speakLetter} className="rounded-2xl mt-4">
                    🎙️ Listen to My Voice
                  </Button>
                </CardContent>
              </Card>

              <DaysCounter days={daysTogether} />
              <LoveTimeline />
              <PhotoSlider />
              <Reasons />
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}

/* FLOATING HEARTS */

function FloatingHearts() {
  const [hearts, setHearts] = useState<any[]>([]);

  useEffect(() => {
    const createHeart = (x: number, y: number) => {
      const id = Date.now() + Math.random();
      setHearts((prev) => [...prev, { id, x, y }]);

      setTimeout(() => {
        setHearts((prev) => prev.filter((h) => h.id !== id));
      }, 1000);
    };

    const mouseMove = (e: MouseEvent) => createHeart(e.clientX, e.clientY);
    const touchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) createHeart(touch.clientX, touch.clientY);
    };

    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("touchmove", touchMove);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
      window.removeEventListener("touchmove", touchMove);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          initial={{ opacity: 1, scale: 0.5 }}
          animate={{ y: -35, opacity: 0, scale: 1.3 }}
          transition={{ duration: 1 }}
          style={{ left: h.x, top: h.y, position: "absolute" }}
        >
          <Heart className="text-pink-400" fill="#fb7185" />
        </motion.div>
      ))}
    </div>
  );
}

/* METEOR SHOWER */

function MeteorShower() {
  const meteors = new Array(6).fill(0);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {meteors.map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: "-10%", y: "-10%", opacity: 0 }}
          animate={{
            x: "120%",
            y: "120%",
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            delay: i * 2,
            repeat: Infinity,
            repeatDelay: 6,
          }}
          className="absolute w-1 h-32 bg-gradient-to-b from-white to-transparent blur-sm rotate-45"
        />
      ))}
    </div>
  );
}

/* TYPEWRITER */

function TypewriterText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 18);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <p className="whitespace-pre-line text-gray-700 leading-relaxed">
      {displayed}
    </p>
  );
}

/* DAYS COUNTER */

function DaysCounter({ days }: { days: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const interval = setInterval(() => {
      start += Math.ceil(days / 40);
      if (start >= days) {
        setCount(days);
        clearInterval(interval);
      } else setCount(start);
    }, 40);
  }, [days]);

  return (
    <Card className="bg-white/95 shadow-xl text-center">
      <CardContent className="p-6">
        <p className="text-gray-500">Days Together</p>
        <h2 className="text-4xl font-bold text-pink-600">{count}</h2>
      </CardContent>
    </Card>
  );
}

/* LOVE TIMELINE */

function LoveTimeline() {
  const events = [
    { date: "May 4, 2020", text: "The day our story began ❤️" },
    { date: "Our Frist Date", text: "Our first date was magical 💕" },
    { date: "First Anniversary", text: "365 days of love 🎉" },
    { date: "Today", text: "Still choosing you, every single day 💕" },
  ];

  return (
    <Card className="bg-white/95 backdrop-blur-xl shadow-xl">
      <CardContent className="p-8">
        <h2 className="text-2xl font-bold text-center text-pink-600 mb-8">
          Our Love Timeline
        </h2>

        <div className="relative">
          <motion.div
            initial={{ height: 0 }}
            whileInView={{ height: "100%" }}
            transition={{ duration: 2 }}
            className="absolute left-4 top-0 w-1 bg-gradient-to-b from-pink-400 to-rose-500 rounded-full"
          />

          <div className="space-y-10">
            {events.map((e, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.3 }}
                className="flex items-start gap-4"
              >
                <div className="w-4 h-4 rounded-full bg-pink-500 shadow-[0_0_12px_rgba(236,72,153,0.9)] mt-2" />

                <div>
                  <p className="font-semibold">{e.date}</p>
                  <p className="text-gray-600">{e.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* PHOTO SLIDER */

function PhotoSlider() {
  const photos = [
    "/photo1.png",
    "/photo2.png",
    "/photo3.png",
    "/photo4.png",
    "/photo5.png",
    "/photo6.png",
    "/photo7.png",
    "/photo8.png",
    "/photo9.png",
    "/photo10.png",
    "/photo11.png",
    "/photo12.png",
    "/photo13.png",
  ];
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev + 1) % photos.length);
  const prev = () =>
    setIndex((prev) => (prev - 1 + photos.length) % photos.length);

  return (
    <Card className="bg-white/95 backdrop-blur-xl shadow-xl">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold text-center text-pink-600 mb-4">
          Our Memories
        </h2>

        <div className="relative h-[560px] md:h-[640px] rounded-2xl overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={photos[index]}
              src={photos[index]}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(e, info) => {
                if (info.offset.x < -80) next();
                if (info.offset.x > 80) prev();
              }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>

          {/* arrows desktop */}
          <button
            onClick={prev}
            className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur px-3 py-1 rounded-full"
          >
            ←
          </button>

          <button
            onClick={next}
            className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 backdrop-blur px-3 py-1 rounded-full"
          >
            →
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-4">
          {photos.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-6 bg-pink-500" : "w-2 bg-pink-200"
              }`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/* REASONS */

function Reasons() {
  const reasons = [
    "Your smile melts my stress instantly",
    "You make ordinary days magical",
    "You believe in me even when I don't",
    "Life is simply brighter with you",
  ];

  const [open, setOpen] = useState<number | null>(null);

  return (
    <Card className="bg-white/95 shadow-xl">
      <CardContent className="p-6 space-y-4">
        <h2 className="text-2xl font-bold text-center text-pink-600">
          Reasons I Love You
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {reasons.map((r, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setOpen(open === i ? null : i)}
              className="cursor-pointer rounded-2xl bg-pink-50 p-4 shadow"
            >
              <p className="font-semibold">❤️ Tap to reveal</p>

              <AnimatePresence>
                {open === i && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-gray-600 mt-2"
                  >
                    {r}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

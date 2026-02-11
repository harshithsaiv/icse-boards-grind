"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

type SoundType = "rain" | "cafe" | "whitenoise";

const SOUND_OPTIONS: { value: SoundType; label: string }[] = [
  { value: "rain", label: "Rain" },
  { value: "cafe", label: "Cafe" },
  { value: "whitenoise", label: "White Noise" },
];

const BUFFER_SIZE = 4096;

export function AmbientPlayer() {
  const [playing, setPlaying] = useState(false);
  const [soundType, setSoundType] = useState<SoundType>("rain");
  const [volume, setVolume] = useState(40);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceNodeRef = useRef<ScriptProcessorNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const lfoGainRef = useRef<GainNode | null>(null);
  const lfoRef = useRef<OscillatorNode | null>(null);

  // Pink noise state for 1/f weighting
  const pinkRef = useRef({ b0: 0, b1: 0, b2: 0, b3: 0, b4: 0, b5: 0, b6: 0 });

  const disconnectNodes = useCallback(() => {
    try {
      lfoRef.current?.stop();
    } catch {
      /* already stopped */
    }
    lfoRef.current?.disconnect();
    lfoRef.current = null;

    lfoGainRef.current?.disconnect();
    lfoGainRef.current = null;

    sourceNodeRef.current?.disconnect();
    sourceNodeRef.current = null;

    filterNodeRef.current?.disconnect();
    filterNodeRef.current = null;
  }, []);

  const generateWhiteNoise = useCallback(
    (e: AudioProcessingEvent) => {
      const output = e.outputBuffer.getChannelData(0);
      for (let i = 0; i < output.length; i++) {
        output[i] = Math.random() * 2 - 1;
      }
    },
    []
  );

  const generatePinkNoise = useCallback(
    (e: AudioProcessingEvent) => {
      const output = e.outputBuffer.getChannelData(0);
      const p = pinkRef.current;
      for (let i = 0; i < output.length; i++) {
        const white = Math.random() * 2 - 1;
        p.b0 = 0.99886 * p.b0 + white * 0.0555179;
        p.b1 = 0.99332 * p.b1 + white * 0.0750759;
        p.b2 = 0.969 * p.b2 + white * 0.153852;
        p.b3 = 0.8665 * p.b3 + white * 0.3104856;
        p.b4 = 0.55 * p.b4 + white * 0.5329522;
        p.b5 = -0.7616 * p.b5 - white * 0.016898;
        output[i] =
          (p.b0 + p.b1 + p.b2 + p.b3 + p.b4 + p.b5 + p.b6 + white * 0.5362) *
          0.11;
        p.b6 = white * 0.115926;
      }
    },
    []
  );

  const createNodes = useCallback(
    (ctx: AudioContext, gain: GainNode, type: SoundType) => {
      disconnectNodes();

      // Reset pink noise coefficients
      pinkRef.current = { b0: 0, b1: 0, b2: 0, b3: 0, b4: 0, b5: 0, b6: 0 };

      const processor = ctx.createScriptProcessor(BUFFER_SIZE, 1, 1);
      sourceNodeRef.current = processor;

      if (type === "rain") {
        // White noise through bandpass filter for rain effect
        processor.onaudioprocess = generateWhiteNoise;

        const bandpass = ctx.createBiquadFilter();
        bandpass.type = "bandpass";
        bandpass.frequency.value = 400;
        bandpass.Q.value = 0.5;
        filterNodeRef.current = bandpass;

        processor.connect(bandpass);
        bandpass.connect(gain);
      } else if (type === "cafe") {
        // Pink noise with subtle amplitude modulation
        processor.onaudioprocess = generatePinkNoise;

        // LFO for amplitude modulation
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 0.8;
        lfoGainRef.current = lfoGain;

        const lfo = ctx.createOscillator();
        lfo.type = "sine";
        lfo.frequency.value = 0.3;
        lfoRef.current = lfo;

        const lfoAmplitude = ctx.createGain();
        lfoAmplitude.gain.value = 0.15;

        lfo.connect(lfoAmplitude);
        lfoAmplitude.connect(lfoGain.gain);
        lfo.start();

        processor.connect(lfoGain);
        lfoGain.connect(gain);
      } else {
        // Pure white noise
        processor.onaudioprocess = generateWhiteNoise;
        processor.connect(gain);
      }
    },
    [disconnectNodes, generateWhiteNoise, generatePinkNoise]
  );

  const handlePlay = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    const ctx = audioCtxRef.current;

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    if (!gainNodeRef.current) {
      gainNodeRef.current = ctx.createGain();
      gainNodeRef.current.connect(ctx.destination);
    }
    gainNodeRef.current.gain.value = volume / 100;

    createNodes(ctx, gainNodeRef.current, soundType);
    setPlaying(true);
  }, [volume, soundType, createNodes]);

  const handlePause = useCallback(() => {
    disconnectNodes();
    setPlaying(false);
  }, [disconnectNodes]);

  const handleToggle = useCallback(() => {
    if (playing) {
      handlePause();
    } else {
      handlePlay();
    }
  }, [playing, handlePlay, handlePause]);

  // Update volume in real time
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume / 100;
    }
  }, [volume]);

  // Recreate nodes when sound type changes while playing
  const handleSoundChange = useCallback(
    (newType: SoundType) => {
      setSoundType(newType);
      if (playing && audioCtxRef.current && gainNodeRef.current) {
        createNodes(audioCtxRef.current, gainNodeRef.current, newType);
      }
    },
    [playing, createNodes]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnectNodes();
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    };
  }, [disconnectNodes]);

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold" style={{ color: "var(--text)" }}>
          Ambient Sound
        </h3>
        <Button
          size="sm"
          variant={playing ? "secondary" : "primary"}
          onClick={handleToggle}
        >
          <span className="flex items-center gap-1.5">
            {playing ? (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            )}
            {playing ? "Pause" : "Play"}
          </span>
        </Button>
      </div>

      <div className="space-y-3">
        {/* Sound Type Selector */}
        <Select
          options={SOUND_OPTIONS}
          value={soundType}
          onChange={(e) => handleSoundChange(e.target.value as SoundType)}
        />

        {/* Volume Slider */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              className="text-sm font-medium"
              style={{ color: "var(--text)" }}
            >
              Volume
            </label>
            <span
              className="text-xs"
              style={{ color: "var(--text-secondary)" }}
            >
              {volume}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => setVolume(parseInt(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, var(--primary) ${volume}%, var(--border) ${volume}%)`,
            }}
          />
        </div>
      </div>
    </Card>
  );
}

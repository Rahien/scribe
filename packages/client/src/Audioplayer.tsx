import { createContext, useContext, useEffect, useRef, useState } from "react";

export const AudioContext = createContext({
  selectedTime: null as number | null,
  setSelectedTime: (time: number) => {
    time;
  },
});

export const AudioContextProvider = ({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) => {
  const [selectedTime, setSelectedTime] = useState<number | null>(null);

  return (
    <AudioContext.Provider value={{ selectedTime, setSelectedTime }}>
      {children}
    </AudioContext.Provider>
  );
};

export const Audioplayer = ({
  file,
  url,
}: { file: File; url?: never } | { url: string; file?: never }) => {
  const { selectedTime } = useContext(AudioContext);
  const ref = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    if (!ref.current || !selectedTime) {
      return;
    }
    ref.current.currentTime = selectedTime || 0;
    ref.current.play();
  }, [selectedTime]);
  return (
    <div>
      <audio
        src={file ? URL.createObjectURL(file) : url}
        controls
        ref={ref}
        css={{
          width: "100%",
          ["@media print"]: {
            display: "none",
          },
        }}
      />
    </div>
  );
};

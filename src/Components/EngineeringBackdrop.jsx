import React from "react";

/**
 * Aeromek AI atmosphere — pure black + electric sky accents.
 */
const EngineeringBackdrop = ({ density = "normal" }) => {
  const showExtras = density !== "light";

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div className="absolute inset-0 bg-black" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_0%,_rgba(56,189,248,0.12),_transparent_52%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_88%_75%,_rgba(14,116,144,0.12),_transparent_48%)]" />

      <div
        className="absolute inset-0 opacity-[0.3]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='56' height='56' viewBox='0 0 56 56' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M56 0H0V56' fill='none' stroke='rgba(56,189,248,0.06)' stroke-width='1'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="absolute -top-28 right-0 w-[560px] h-[560px] rounded-full bg-sky-500/[0.06] blur-[110px]" />
      <div className="absolute bottom-[-80px] -left-20 w-[500px] h-[500px] rounded-full bg-blue-900/[0.12] blur-[100px]" />

      {showExtras &&
        [
          { left: "16%", top: "20%" },
          { left: "74%", top: "16%" },
          { left: "56%", top: "72%" },
        ].map((dot) => (
          <span
            key={`${dot.left}-${dot.top}`}
            className="absolute w-1.5 h-1.5 rounded-full bg-sky-400/35"
            style={{ left: dot.left, top: dot.top }}
          />
        ))}

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-400/35 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-800/25 to-transparent" />
    </div>
  );
};

export default EngineeringBackdrop;

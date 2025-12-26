"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-slate-900/60 group-[.toaster]:backdrop-blur-2xl group-[.toaster]:text-white group-[.toaster]:border-white/10 group-[.toaster]:shadow-[0_20px_50px_rgba(0,0,0,0.5)] group-[.toaster]:rounded-[2rem] group-[.toaster]:p-5 group-[.toaster]:font-bold group-[.toaster]:transition-all group-[.toaster]:duration-500 group-[.toaster]:hover:scale-[1.02]",
          description: "group-[.toast]:text-slate-400 group-[.toast]:font-medium group-[.toast]:text-xs",
          actionButton:
            "group-[.toast]:bg-cyan-500 group-[.toast]:text-white group-[.toast]:rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] px-4",
          cancelButton:
            "group-[.toast]:bg-white/5 group-[.toast]:text-slate-400 group-[.toast]:rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] px-4",
          success: "group-[.toast]:border-emerald-500/40 group-[.toast]:bg-emerald-500/5",
          error: "group-[.toast]:border-rose-500/40 group-[.toast]:bg-rose-500/5",
          info: "group-[.toast]:border-cyan-500/40 group-[.toast]:bg-cyan-500/5",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

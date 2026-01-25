"use client";

import { useEffect, useRef, useCallback, useTransition, useState } from "react";
import { cn } from "@/lib/utils";
import {
    ImageIcon,
    Figma,
    MonitorIcon,
    XIcon,
    Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as React from "react";

interface UseAutoResizeTextareaProps {
    minHeight: number;
    maxHeight?: number;
}

function useAutoResizeTextarea({
    minHeight,
    maxHeight,
}: UseAutoResizeTextareaProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = useCallback(
        (reset?: boolean) => {
            const textarea = textareaRef.current;
            if (!textarea) return;

            if (reset) {
                textarea.style.height = `${minHeight}px`;
                return;
            }

            textarea.style.height = `${minHeight}px`;
            const newHeight = Math.max(
                minHeight,
                Math.min(
                    textarea.scrollHeight,
                    maxHeight ?? Number.POSITIVE_INFINITY
                )
            );

            textarea.style.height = `${newHeight}px`;
        },
        [minHeight, maxHeight]
    );

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = `${minHeight}px`;
        }
    }, [minHeight]);

    useEffect(() => {
        const handleResize = () => adjustHeight();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [adjustHeight]);

    return { textareaRef, adjustHeight };
}

interface CommandSuggestion {
    icon: React.ReactNode;
    label: string;
    description: string;
    prefix: string;
}

interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    containerClassName?: string;
    showRing?: boolean;
}

const AnimatedTextarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, containerClassName, showRing = true, ...props }, ref) => {
        const [isFocused, setIsFocused] = React.useState(false);

        return (
            <div className={cn("relative", containerClassName)}>
                <textarea
                    className={cn(
                        "flex min-h-[80px] w-full rounded-md border-none bg-transparent px-3 py-2 text-sm",
                        "transition-all duration-200 ease-in-out",
                        "placeholder:text-white/30",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        "text-white",
                        showRing
                            ? "focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                            : "",
                        className
                    )}
                    ref={ref}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                />

                {showRing && isFocused && (
                    <motion.span
                        className="absolute inset-0 rounded-md pointer-events-none ring-1 ring-white/20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    />
                )}
            </div>
        );
    }
);
AnimatedTextarea.displayName = "AnimatedTextarea";

interface AnimatedAIChatProps {
    onGenerate?: (prompt: string, command?: string) => void;
    isGenerating?: boolean;
    remainingPrompts?: number | null;
    isPremium?: boolean;
}

export function AnimatedAIChat({ onGenerate, isGenerating: externalIsGenerating, remainingPrompts, isPremium }: AnimatedAIChatProps) {
    const [value, setValue] = useState("");
    const [attachments, setAttachments] = useState<string[]>([]);
    const [isPending, startTransition] = useTransition();
    const [activeCommand, setActiveCommand] = useState<string | null>(null);
    const [activeSuggestion, setActiveSuggestion] = useState<number>(-1);
    const [showCommandPalette, setShowCommandPalette] = useState(false);
    const [recentCommand, setRecentCommand] = useState<string | null>(null);
    const { textareaRef, adjustHeight } = useAutoResizeTextarea({
        minHeight: 60,
        maxHeight: 200,
    });
    const [inputFocused, setInputFocused] = useState(false);
    const commandPaletteRef = useRef<HTMLDivElement>(null);

    const commandSuggestions: CommandSuggestion[] = [
        {
            icon: <ImageIcon className="w-4 h-4" />,
            label: "Logo Design",
            description: "Generate a professional logo",
            prefix: "/logo",
        },
        {
            icon: <Figma className="w-4 h-4" />,
            label: "Social Media",
            description: "Create social media graphics",
            prefix: "/social",
        },
        {
            icon: <MonitorIcon className="w-4 h-4" />,
            label: "Banner",
            description: "Design a web banner",
            prefix: "/banner",
        },
        {
            icon: <Sparkles className="w-4 h-4" />,
            label: "Poster",
            description: "Create a stunning poster",
            prefix: "/poster",
        },
    ];

    useEffect(() => {
        if (value.startsWith("/") && !value.includes(" ")) {
            setShowCommandPalette(true);

            const matchingSuggestionIndex = commandSuggestions.findIndex((cmd) =>
                cmd.prefix.startsWith(value)
            );

            if (matchingSuggestionIndex >= 0) {
                setActiveSuggestion(matchingSuggestionIndex);
            } else {
                setActiveSuggestion(-1);
            }
        } else {
            setShowCommandPalette(false);
        }
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            const commandButton = document.querySelector("[data-command-button]");

            if (
                commandPaletteRef.current &&
                !commandPaletteRef.current.contains(target) &&
                !commandButton?.contains(target)
            ) {
                setShowCommandPalette(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (showCommandPalette) {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setActiveSuggestion((prev) =>
                    prev < commandSuggestions.length - 1 ? prev + 1 : 0
                );
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActiveSuggestion((prev) =>
                    prev > 0 ? prev - 1 : commandSuggestions.length - 1
                );
            } else if (e.key === "Tab" || e.key === "Enter") {
                e.preventDefault();
                if (activeSuggestion >= 0) {
                    const selectedCommand = commandSuggestions[activeSuggestion];
                    setValue(selectedCommand.prefix + " ");
                    setShowCommandPalette(false);

                    setRecentCommand(selectedCommand.label);
                    setTimeout(() => setRecentCommand(null), 3500);
                }
            } else if (e.key === "Escape") {
                e.preventDefault();
                setShowCommandPalette(false);
            }
        } else if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (value.trim()) {
                handleSendMessage();
            }
        }
    };

    const handleSendMessage = () => {
        if (value.trim() && !externalIsGenerating) {
            const commandMatch = value.match(/^\/(\w+)\s*/);
            const command = commandMatch ? commandMatch[1] : undefined;
            const cleanPrompt = command ? value.replace(/^\/\w+\s*/, '') : value;
            
            onGenerate?.(cleanPrompt.trim(), command);
            setValue("");
            adjustHeight(true);
            setActiveCommand(null);
        }
    };

    const handleAttachFile = () => {
        const mockFileName = `design-${Math.floor(Math.random() * 1000)}.png`;
        setAttachments((prev) => [...prev, mockFileName]);
    };

    const removeAttachment = (index: number) => {
        setAttachments((prev) => prev.filter((_, i) => i !== index));
    };

    const selectCommandSuggestion = (index: number) => {
        const selectedCommand = commandSuggestions[index];
        setValue(selectedCommand.prefix + " ");
        setShowCommandPalette(false);

        setRecentCommand(selectedCommand.label);
        setTimeout(() => setRecentCommand(null), 2000);
    };

    return (
        <div className="w-full flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden">
            <div className="w-full max-w-2xl mx-auto relative">
                <motion.div
                    className="relative z-10 space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    {/* Header Section */}
                    <div className="text-center space-y-3">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="inline-block"
                        >
                        <h2 className="text-xl md:text-2xl font-medium tracking-tight text-white pb-1">
                                EPIC CAN MAKE YOU DESIGNS.......
                            </h2>
                            <motion.div
                                className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: "100%", opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                            />
                        </motion.div>
                        <motion.p
                            className="text-xs md:text-sm text-white/50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            Describe your design idea or use a command
                        </motion.p>
                        {remainingPrompts !== null && remainingPrompts !== undefined && (
                            <motion.div
                                className="flex items-center justify-center gap-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                <span className="text-xs px-3 py-1.5 rounded-full bg-white/5 text-white/70 border border-white/10 backdrop-blur-sm">
                                    <span className="text-green-400">{remainingPrompts}</span> / {isPremium ? '25' : '2'} generations left today
                                </span>
                            </motion.div>
                        )}
                    </div>

                    {/* Glass Card Input Container */}
                    <motion.div
                        className="relative overflow-hidden rounded-2xl"
                        initial={{ scale: 0.98 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        {/* Glass background layers */}
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-xl" />
                        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] to-transparent" />
                        <div className="absolute inset-0 rounded-2xl border border-white/10" />
                        
                        {/* Animated glow effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />

                        {/* Command Palette */}
                        <AnimatePresence>
                            {showCommandPalette && (
                                <motion.div
                                    ref={commandPaletteRef}
                                    className="absolute left-4 right-4 bottom-full mb-2 z-50 overflow-hidden rounded-xl"
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 5 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    <div className="relative bg-black/60 backdrop-blur-2xl border border-white/10 rounded-xl overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent" />
                                        <div className="relative py-1">
                                            {commandSuggestions.map((suggestion, index) => (
                                                <motion.div
                                                    key={suggestion.prefix}
                                                    className={cn(
                                                        "flex items-center gap-3 px-4 py-3 text-sm transition-all cursor-pointer relative",
                                                        activeSuggestion === index
                                                            ? "bg-white/10"
                                                            : "hover:bg-white/5"
                                                    )}
                                                    onClick={() => selectCommandSuggestion(index)}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: index * 0.03 }}
                                                >
                                                    <div className={cn(
                                                        "w-8 h-8 flex items-center justify-center rounded-lg transition-colors",
                                                        activeSuggestion === index
                                                            ? "bg-white/10 text-white"
                                                            : "bg-white/5 text-white/60"
                                                    )}>
                                                        {suggestion.icon}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-medium text-white">
                                                            {suggestion.label}
                                                        </div>
                                                        <div className="text-white/40 text-xs">
                                                            {suggestion.description}
                                                        </div>
                                                    </div>
                                                    <div className="text-white/30 text-xs font-mono">
                                                        {suggestion.prefix}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Textarea Section */}
                        <div className="relative p-4">
                            <AnimatedTextarea
                                ref={textareaRef}
                                value={value}
                                onChange={(e) => {
                                    setValue(e.target.value);
                                    adjustHeight();
                                }}
                                onKeyDown={handleKeyDown}
                                onFocus={() => setInputFocused(true)}
                                onBlur={() => setInputFocused(false)}
                                placeholder="Describe your design... e.g., 'A minimalist logo for a coffee shop'"
                                containerClassName="w-full"
                                className={cn(
                                    "w-full px-2 py-2",
                                    "resize-none",
                                    "bg-transparent",
                                    "border-none",
                                    "text-white text-sm",
                                    "focus:outline-none",
                                    "placeholder:text-white/30",
                                    "min-h-[60px]"
                                )}
                                style={{
                                    overflow: "hidden",
                                }}
                                showRing={false}
                            />
                        </div>

                        {/* Attachments */}
                        <AnimatePresence>
                            {attachments.length > 0 && (
                                <motion.div
                                    className="relative px-4 pb-3 flex gap-2 flex-wrap"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    {attachments.map((file, index) => (
                                        <motion.div
                                            key={index}
                                            className="flex items-center gap-2 text-xs bg-white/5 border border-white/10 py-1.5 px-3 rounded-lg text-white/70"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                        >
                                            <span>{file}</span>
                                            <button
                                                onClick={() => removeAttachment(index)}
                                                className="text-white/40 hover:text-white transition-colors"
                                            >
                                                <XIcon className="w-3 h-3" />
                                            </button>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Footer Actions */}
                        <div className="relative p-4 border-t border-white/10 flex items-center justify-center">
                            {/* Generate Button with Glass Effect */}
                            <motion.button
                                type="button"
                                onClick={handleSendMessage}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={!value.trim() || externalIsGenerating}
                                className={cn(
                                    "relative px-8 py-3 rounded-xl text-sm font-medium transition-all overflow-hidden",
                                    "flex items-center gap-2",
                                    value.trim() && !externalIsGenerating
                                        ? "text-white"
                                        : "text-white/30 cursor-not-allowed"
                                )}
                            >
                                {/* Button background */}
                                <div className={cn(
                                    "absolute inset-0 transition-all",
                                    value.trim() && !externalIsGenerating
                                        ? "bg-gradient-to-r from-rose-500/80 via-orange-500/80 to-amber-500/80"
                                        : "bg-white/5"
                                )} />
                                
                                {/* Glass overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10" />
                                
                                {/* Border */}
                                <div className={cn(
                                    "absolute inset-0 rounded-xl border transition-all",
                                    value.trim() && !externalIsGenerating
                                        ? "border-white/20"
                                        : "border-white/5"
                                )} />

                                {/* Content */}
                                <span className="relative z-10 flex items-center gap-2">
                                    {externalIsGenerating ? (
                                        <>
                                            <motion.div
                                                className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                                                animate={{ rotate: 360 }}
                                                transition={{
                                                    duration: 1,
                                                    repeat: Infinity,
                                                    ease: "linear",
                                                }}
                                            />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4" />
                                            Generate
                                        </>
                                    )}
                                </span>
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Quick Suggestion Pills */}
                    <motion.div
                        className="flex flex-wrap justify-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        {["Logo", "Social Post", "Banner", "Poster", "Business Card"].map(
                            (suggestion) => (
                                <motion.button
                                    key={suggestion}
                                    onClick={() => setValue(`Create a ${suggestion.toLowerCase()} for `)}
                                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-4 py-2 text-xs rounded-full bg-white/5 text-white/60 hover:text-white transition-all border border-white/10 backdrop-blur-sm"
                                >
                                    {suggestion}
                                </motion.button>
                            )
                        )}
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}

"use client";

import { useEffect, useRef, useCallback, useTransition, useState } from "react";
import { cn } from "@/lib/utils";
import {
    ImageIcon,
    Figma,
    MonitorIcon,
    Paperclip,
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
                        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                        "transition-all duration-200 ease-in-out",
                        "placeholder:text-muted-foreground",
                        "disabled:cursor-not-allowed disabled:opacity-50",
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
                        className="absolute inset-0 rounded-md pointer-events-none ring-2 ring-offset-0 ring-violet-500/30"
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
    onGenerate?: (prompt: string) => void;
}

export function AnimatedAIChat({ onGenerate }: AnimatedAIChatProps) {
    const [value, setValue] = useState("");
    const [attachments, setAttachments] = useState<string[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [isPending, startTransition] = useTransition();
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
        if (value.trim()) {
            onGenerate?.(value.trim());
            startTransition(() => {
                setIsTyping(true);
                setTimeout(() => {
                    setIsTyping(false);
                    setValue("");
                    adjustHeight(true);
                }, 1000);
            });
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
        <div className="w-full flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full mix-blend-normal filter blur-[128px] animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full mix-blend-normal filter blur-[128px] animate-pulse delay-700" />
                <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-fuchsia-500/10 rounded-full mix-blend-normal filter blur-[96px] animate-pulse delay-1000" />
            </div>
            <div className="w-full max-w-2xl mx-auto relative">
                <motion.div
                    className="relative z-10 space-y-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <div className="text-center space-y-3">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="inline-block"
                        >
                            <h2 className="text-2xl md:text-3xl font-medium tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60 pb-1">
                                What would you like to design?
                            </h2>
                            <motion.div
                                className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: "100%", opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                            />
                        </motion.div>
                        <motion.p
                            className="text-sm text-muted-foreground"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            Describe your design idea or use a command
                        </motion.p>
                    </div>

                    <motion.div
                        className="relative backdrop-blur-2xl bg-card/50 rounded-2xl border border-border shadow-2xl"
                        initial={{ scale: 0.98 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        <AnimatePresence>
                            {showCommandPalette && (
                                <motion.div
                                    ref={commandPaletteRef}
                                    className="absolute left-4 right-4 bottom-full mb-2 backdrop-blur-xl bg-popover rounded-lg z-50 shadow-lg border border-border overflow-hidden"
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 5 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    <div className="py-1">
                                        {commandSuggestions.map((suggestion, index) => (
                                            <motion.div
                                                key={suggestion.prefix}
                                                className={cn(
                                                    "flex items-center gap-2 px-3 py-2 text-xs transition-colors cursor-pointer",
                                                    activeSuggestion === index
                                                        ? "bg-accent text-accent-foreground"
                                                        : "text-muted-foreground hover:bg-accent/50"
                                                )}
                                                onClick={() => selectCommandSuggestion(index)}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: index * 0.03 }}
                                            >
                                                <div className="w-5 h-5 flex items-center justify-center text-muted-foreground">
                                                    {suggestion.icon}
                                                </div>
                                                <div className="font-medium text-foreground">
                                                    {suggestion.label}
                                                </div>
                                                <div className="text-muted-foreground text-xs ml-1">
                                                    {suggestion.prefix}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="p-4">
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
                                    "w-full px-4 py-3",
                                    "resize-none",
                                    "bg-transparent",
                                    "border-none",
                                    "text-foreground text-sm",
                                    "focus:outline-none",
                                    "placeholder:text-muted-foreground/50",
                                    "min-h-[60px]"
                                )}
                                style={{
                                    overflow: "hidden",
                                }}
                                showRing={false}
                            />
                        </div>

                        <AnimatePresence>
                            {attachments.length > 0 && (
                                <motion.div
                                    className="px-4 pb-3 flex gap-2 flex-wrap"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    {attachments.map((file, index) => (
                                        <motion.div
                                            key={index}
                                            className="flex items-center gap-2 text-xs bg-muted py-1.5 px-3 rounded-lg text-muted-foreground"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                        >
                                            <span>{file}</span>
                                            <button
                                                onClick={() => removeAttachment(index)}
                                                className="text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                <XIcon className="w-3 h-3" />
                                            </button>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="p-4 border-t border-border flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <motion.button
                                    type="button"
                                    onClick={handleAttachFile}
                                    whileTap={{ scale: 0.94 }}
                                    className="p-2 text-muted-foreground hover:text-foreground rounded-lg transition-colors relative group"
                                >
                                    <Paperclip className="w-4 h-4" />
                                    <motion.span
                                        className="absolute inset-0 bg-accent/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                        layoutId="button-highlight"
                                    />
                                </motion.button>
                                <motion.button
                                    type="button"
                                    data-command-button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowCommandPalette((prev) => !prev);
                                    }}
                                    whileTap={{ scale: 0.94 }}
                                    className={cn(
                                        "flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs transition-colors",
                                        showCommandPalette
                                            ? "bg-accent text-accent-foreground"
                                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                                    )}
                                >
                                    <span>/</span>
                                    <span className="text-muted-foreground">Commands</span>
                                </motion.button>
                            </div>

                            <div className="flex items-center gap-2">
                                <AnimatePresence>
                                    {recentCommand && (
                                        <motion.div
                                            className="text-xs text-primary flex items-center gap-1"
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                        >
                                            <Sparkles className="w-3 h-3" />
                                            {recentCommand}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <motion.button
                                    type="button"
                                    onClick={handleSendMessage}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={!value.trim() || isTyping}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                                        "flex items-center gap-2",
                                        value.trim()
                                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                            : "bg-muted text-muted-foreground cursor-not-allowed"
                                    )}
                                >
                                    {isTyping ? (
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
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>

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
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-3 py-1.5 text-xs rounded-full bg-muted/50 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors border border-border/50"
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

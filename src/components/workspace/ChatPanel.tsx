import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Sparkles, ImageIcon, Figma, MonitorIcon, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  imageUrl?: string;
}

interface ChatPanelProps {
  onGenerate: (prompt: string, command?: string) => void;
  isGenerating: boolean;
  generatedImage: string | null;
  remainingPrompts: number | null;
  isPremium: boolean;
}

const commandSuggestions = [
  { icon: <ImageIcon className="w-4 h-4" />, label: "Logo", prefix: "/logo", description: "Professional logo" },
  { icon: <Figma className="w-4 h-4" />, label: "Social", prefix: "/social", description: "Social media" },
  { icon: <MonitorIcon className="w-4 h-4" />, label: "Banner", prefix: "/banner", description: "Web banner" },
  { icon: <Sparkles className="w-4 h-4" />, label: "Poster", prefix: "/poster", description: "Stunning poster" },
];

export function ChatPanel({ 
  onGenerate, 
  isGenerating, 
  generatedImage,
  remainingPrompts,
  isPremium 
}: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hey! I'm your AI design assistant. Tell me what you want to create – a logo, banner, poster, or anything else. Just describe it naturally!",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState("");
  const [showCommands, setShowCommands] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  // Add generated image as assistant message
  useEffect(() => {
    if (generatedImage) {
      const lastUserMsg = messages.filter(m => m.role === "user").pop();
      setMessages(prev => [
        ...prev,
        {
          id: `img-${Date.now()}`,
          role: "assistant",
          content: "Here's your design! You can edit it by typing instructions like 'make it darker' or 'add more contrast'.",
          timestamp: new Date(),
          imageUrl: generatedImage,
        }
      ]);
    }
  }, [generatedImage]);

  const handleSend = () => {
    if (!input.trim() || isGenerating) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    // Parse command
    const commandMatch = input.match(/^\/(\w+)\s*/);
    const command = commandMatch ? commandMatch[1] : undefined;
    const cleanPrompt = command ? input.replace(/^\/\w+\s*/, '') : input;

    onGenerate(cleanPrompt.trim(), command);
    setInput("");
    setShowCommands(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const selectCommand = (prefix: string) => {
    setInput(prefix + " ");
    setShowCommands(false);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full bg-background/95 backdrop-blur-xl">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-border/30 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-sm">AI Designer</h2>
              <p className="text-xs text-muted-foreground">Design by talking</p>
            </div>
          </div>
          {remainingPrompts !== null && (
            <div className="px-3 py-1.5 rounded-full bg-muted/50 text-xs">
              <span className="text-primary font-medium">{remainingPrompts}</span>
              <span className="text-muted-foreground"> / {isPremium ? '25' : '2'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        <AnimatePresence mode="popLayout">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className={cn(
                "flex",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-3 shadow-sm",
                  message.role === "user"
                    ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-br-sm"
                    : "bg-muted/30 backdrop-blur-sm border border-border/30 text-foreground rounded-bl-sm"
                )}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                {message.imageUrl && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-border/20 shadow-lg">
                    <img 
                      src={message.imageUrl} 
                      alt="Generated design" 
                      className="w-full h-auto"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Generating indicator */}
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-muted/50 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-primary"
                    animate={{ y: [-2, 2, -2] }}
                    transition={{ duration: 0.6, delay: i * 0.1, repeat: Infinity }}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">Creating your design...</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Commands */}
      <AnimatePresence>
        {showCommands && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex-shrink-0 px-4 pb-2"
          >
            <div className="bg-muted/30 rounded-xl p-2 border border-border/50">
              <div className="grid grid-cols-2 gap-2">
                {commandSuggestions.map((cmd) => (
                  <button
                    key={cmd.prefix}
                    onClick={() => selectCommand(cmd.prefix)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                      {cmd.icon}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{cmd.label}</div>
                      <div className="text-xs text-muted-foreground">{cmd.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="flex-shrink-0 p-4 border-t border-border/30 bg-gradient-to-t from-background to-transparent">
        <div className="relative">
          <div className="flex items-end gap-2 bg-muted/20 backdrop-blur-sm rounded-2xl border border-border/30 p-2 shadow-lg shadow-black/5 focus-within:border-primary/50 focus-within:shadow-primary/10 transition-all">
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0 h-9 w-9 rounded-xl hover:bg-primary/10"
              onClick={() => setShowCommands(!showCommands)}
            >
              <Command className="w-4 h-4" />
            </Button>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your design..."
              rows={1}
              className={cn(
                "flex-1 resize-none bg-transparent border-none outline-none",
                "text-sm placeholder:text-muted-foreground/60",
                "min-h-[36px] max-h-[120px] py-2"
              )}
              style={{ height: "36px" }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "36px";
                target.style.height = Math.min(target.scrollHeight, 120) + "px";
              }}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isGenerating}
              size="icon"
              className="flex-shrink-0 h-9 w-9 rounded-xl bg-primary hover:bg-primary/90"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Press Enter to send • Use /logo, /banner, /poster for quick designs
          </p>
        </div>
      </div>
    </div>
  );
}

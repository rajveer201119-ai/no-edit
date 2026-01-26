import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ChatMessage, ActionButton, ACTION_BUTTONS } from "./types";
import { ActionButtons } from "./ActionButtons";
import { Send, Loader2, Zap, Bot, User, Sparkles } from "lucide-react";

interface ChatPanelProps {
  messages: ChatMessage[];
  isLoading: boolean;
  isPremium: boolean;
  remainingCredits: number | null;
  onSendMessage: (message: string) => void;
  onAction: (action: ActionButton) => void;
  onUpgradeClick: () => void;
}

export const ChatPanel = ({
  messages,
  isLoading,
  isPremium,
  remainingCredits,
  onSendMessage,
  onAction,
  onUpgradeClick,
}: ChatPanelProps) => {
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = () => {
    if (!inputValue.trim() || isLoading) return;
    onSendMessage(inputValue.trim());
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background/80 backdrop-blur-xl">
      {/* Header with credits */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">AI Studio</h3>
            <p className="text-[10px] text-muted-foreground">Describe your vision</p>
          </div>
        </div>
        
        {remainingCredits !== null && (
          <Badge 
            variant="outline" 
            className={cn(
              "px-2 py-1 text-xs font-mono border",
              remainingCredits === 0 
                ? "border-destructive/50 text-destructive bg-destructive/10" 
                : "border-primary/30 text-primary bg-primary/10"
            )}
          >
            <Zap className="h-3 w-3 mr-1" />
            {remainingCredits}/{isPremium ? 10 : 1}
          </Badge>
        )}
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-3 border-b border-border/10">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 font-medium">
          Quick Actions
        </p>
        <ActionButtons
          actions={ACTION_BUTTONS}
          isPremium={isPremium}
          isLoading={isLoading}
          onAction={onAction}
          onUpgradeClick={onUpgradeClick}
        />
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4" ref={scrollRef}>
        <div className="py-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "assistant" && (
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                  <Bot className="h-3.5 w-3.5 text-primary" />
                </div>
              )}
              
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-muted/50 text-foreground border border-border/30 rounded-bl-md"
                )}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                <span className="text-[9px] opacity-60 mt-1 block">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              {message.role === "user" && (
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-foreground/10 flex items-center justify-center">
                  <User className="h-3.5 w-3.5 text-foreground" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                <Bot className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="bg-muted/50 border border-border/30 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Creating magic...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-border/20 bg-background/60">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your edit..."
              disabled={isLoading}
              className="min-h-[48px] max-h-[120px] resize-none pr-12 bg-card/50 border-border/40 focus:border-primary/50 rounded-xl text-sm"
            />
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !inputValue.trim()}
            size="icon"
            className="h-12 w-12 rounded-xl bg-primary hover:bg-primary/90 shrink-0"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
        <p className="text-[10px] text-center text-muted-foreground mt-2">
          Press <kbd className="px-1 py-0.5 rounded bg-muted text-[9px]">Enter</kbd> to send
        </p>
      </div>
    </div>
  );
};

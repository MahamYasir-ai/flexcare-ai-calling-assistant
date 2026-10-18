import React, { useEffect, useState } from 'react';
import { X, Bot, MessageSquare, ChevronDown } from 'lucide-react';

interface OmniWidgetControllerProps {
  agentName?: string;
}

export const OmniWidgetController: React.FC<OmniWidgetControllerProps> = ({
  agentName = 'FlexCare AI Assistant',
}) => {
  const [isWidgetVisible, setIsWidgetVisible] = useState(true);
  const [widgetFound, setWidgetFound] = useState(false);
  const [topPos, setTopPos] = useState<number | null>(null);
  const [rightPos, setRightPos] = useState<number | null>(null);

  useEffect(() => {
    const applyWidgetConstraints = () => {
      // Find any element or iframe created by omnidim
      const widgetElements = document.querySelectorAll<HTMLElement>(
        'iframe[src*="omnidim"], div[id*="omnidim"], div[class*="omnidim"], #omnidimension-web-widget-container, .omnidim-widget'
      );

      if (widgetElements.length > 0) {
        setWidgetFound(true);
        widgetElements.forEach((el) => {
          // Constrain size and prevent crossing the website top
          el.style.setProperty('max-height', '490px', 'important');
          el.style.setProperty('max-width', '370px', 'important');
          el.style.setProperty('top', 'auto', 'important');
          el.style.setProperty('bottom', '24px', 'important');
          el.style.setProperty('right', '24px', 'important');
          el.style.setProperty('border-radius', '16px', 'important');
          el.style.setProperty('box-shadow', '0 10px 25px -5px rgba(15, 23, 42, 0.25)', 'important');
          
          if (!isWidgetVisible) {
            el.style.setProperty('display', 'none', 'important');
          } else {
            el.style.removeProperty('display');
          }

          // Compute position for the top cross button
          const rect = el.getBoundingClientRect();
          if (rect.width > 50 && rect.height > 100 && isWidgetVisible) {
            setTopPos(rect.top);
            setRightPos(window.innerWidth - rect.right);
          }
        });
      }
    };

    applyWidgetConstraints();
    const interval = setInterval(applyWidgetConstraints, 500);

    return () => clearInterval(interval);
  }, [isWidgetVisible]);

  const handleVanish = () => {
    setIsWidgetVisible(false);
    // Explicitly hide all omnidim elements
    const widgetElements = document.querySelectorAll<HTMLElement>(
      'iframe[src*="omnidim"], div[id*="omnidim"], div[class*="omnidim"], #omnidimension-web-widget-container'
    );
    widgetElements.forEach((el) => {
      el.style.setProperty('display', 'none', 'important');
    });
  };

  const handleShow = () => {
    setIsWidgetVisible(true);
    const widgetElements = document.querySelectorAll<HTMLElement>(
      'iframe[src*="omnidim"], div[id*="omnidim"], div[class*="omnidim"], #omnidimension-web-widget-container'
    );
    widgetElements.forEach((el) => {
      el.style.removeProperty('display');
    });
  };

  return (
    <>
      {/* 1. Close/Cross Button Bar attached right at the top of the active chatbot */}
      {isWidgetVisible && (
        <div 
          className="fixed bottom-[518px] right-6 z-[9999] flex items-center space-x-2 bg-slate-900/90 text-white px-3 py-1.5 rounded-full shadow-lg border border-slate-700 backdrop-blur-sm transition-all duration-200"
          title="Click the cross (X) to vanish the chatbot"
        >
          <div className="flex items-center space-x-1.5 text-xs font-bold text-teal-300">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span>{agentName}</span>
          </div>
          <span className="text-slate-500">|</span>
          <button
            onClick={handleVanish}
            className="flex items-center space-x-1 bg-rose-600 hover:bg-rose-700 text-white px-2 py-0.5 rounded-full text-xs font-bold transition-transform active:scale-95 cursor-pointer shadow-xs"
            title="Vanish chatbot"
          >
            <X className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Close</span>
          </button>
        </div>
      )}

      {/* 2. Re-Open Floating Trigger (when chatbot is vanished) */}
      {!isWidgetVisible && (
        <div className="fixed bottom-6 right-6 z-[9999]">
          <button
            onClick={handleShow}
            className="flex items-center space-x-2.5 bg-teal-700 hover:bg-teal-800 text-white px-4 py-3 rounded-2xl shadow-xl border border-teal-500/30 font-bold text-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <div className="relative">
              <Bot className="w-5 h-5 text-teal-200" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-teal-800" />
            </div>
            <span>Open {agentName}</span>
          </button>
        </div>
      )}
    </>
  );
};

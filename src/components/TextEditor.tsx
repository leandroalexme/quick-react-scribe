
import React, { useState, useRef, useCallback } from 'react';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Type, Save, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface ToolbarButtonProps {
  icon: React.ReactNode;
  isActive?: boolean;
  onClick: () => void;
  title: string;
}

const ToolbarButton = ({ icon, isActive, onClick, title }: ToolbarButtonProps) => (
  <Button
    variant="ghost"
    size="sm"
    className={cn(
      "h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200",
      isActive && "bg-blue-100 text-blue-600"
    )}
    onClick={onClick}
    title={title}
  >
    {icon}
  </Button>
);

const TextEditor = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());
  const [fontSize, setFontSize] = useState('16');
  const [wordCount, setWordCount] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const executeCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    updateActiveFormats();
    updateWordCount();
  }, []);

  const updateActiveFormats = useCallback(() => {
    const formats = new Set<string>();
    if (document.queryCommandState('bold')) formats.add('bold');
    if (document.queryCommandState('italic')) formats.add('italic');
    if (document.queryCommandState('underline')) formats.add('underline');
    if (document.queryCommandState('justifyLeft')) formats.add('left');
    if (document.queryCommandState('justifyCenter')) formats.add('center');
    if (document.queryCommandState('justifyRight')) formats.add('right');
    setActiveFormats(formats);
  }, []);

  const updateWordCount = useCallback(() => {
    if (editorRef.current) {
      const text = editorRef.current.innerText;
      const words = text.trim().split(/\s+/).filter(word => word.length > 0);
      setWordCount(words.length);
    }
  }, []);

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    executeCommand('fontSize', '3');
    if (editorRef.current) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        span.style.fontSize = `${size}px`;
        try {
          range.surroundContents(span);
        } catch (e) {
          // Handle cases where range spans multiple elements
          span.appendChild(range.extractContents());
          range.insertNode(span);
        }
      }
    }
  };

  const saveContent = () => {
    // Simulate saving
    setLastSaved(new Date());
    // In a real app, you would save to a backend here
    console.log('Content saved:', editorRef.current?.innerHTML);
  };

  const handleInput = () => {
    updateActiveFormats();
    updateWordCount();
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Text Editor</h1>
              <p className="text-sm text-gray-600">Rich text editing made simple</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              {wordCount} words
            </div>
            {lastSaved && (
              <div className="text-sm text-green-600">
                Saved at {lastSaved.toLocaleTimeString()}
              </div>
            )}
            <Button onClick={saveContent} className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <div className="flex items-center space-x-1">
          {/* Text Formatting */}
          <div className="flex items-center space-x-1">
            <ToolbarButton
              icon={<Bold className="h-4 w-4" />}
              isActive={activeFormats.has('bold')}
              onClick={() => executeCommand('bold')}
              title="Bold"
            />
            <ToolbarButton
              icon={<Italic className="h-4 w-4" />}
              isActive={activeFormats.has('italic')}
              onClick={() => executeCommand('italic')}
              title="Italic"
            />
            <ToolbarButton
              icon={<Underline className="h-4 w-4" />}
              isActive={activeFormats.has('underline')}
              onClick={() => executeCommand('underline')}
              title="Underline"
            />
          </div>

          <Separator orientation="vertical" className="h-6 mx-2" />

          {/* Text Alignment */}
          <div className="flex items-center space-x-1">
            <ToolbarButton
              icon={<AlignLeft className="h-4 w-4" />}
              isActive={activeFormats.has('left')}
              onClick={() => executeCommand('justifyLeft')}
              title="Align Left"
            />
            <ToolbarButton
              icon={<AlignCenter className="h-4 w-4" />}
              isActive={activeFormats.has('center')}
              onClick={() => executeCommand('justifyCenter')}
              title="Align Center"
            />
            <ToolbarButton
              icon={<AlignRight className="h-4 w-4" />}
              isActive={activeFormats.has('right')}
              onClick={() => executeCommand('justifyRight')}
              title="Align Right"
            />
          </div>

          <Separator orientation="vertical" className="h-6 mx-2" />

          {/* Font Size */}
          <div className="flex items-center space-x-2">
            <Type className="h-4 w-4 text-gray-600" />
            <select
              value={fontSize}
              onChange={(e) => handleFontSizeChange(e.target.value)}
              className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="12">12px</option>
              <option value="14">14px</option>
              <option value="16">16px</option>
              <option value="18">18px</option>
              <option value="20">20px</option>
              <option value="24">24px</option>
              <option value="32">32px</option>
            </select>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="p-6">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onMouseUp={updateActiveFormats}
          onKeyUp={updateActiveFormats}
          className="min-h-[400px] p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          style={{ 
            fontSize: `${fontSize}px`,
            lineHeight: '1.6'
          }}
          placeholder="Start writing your content here..."
        />
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            Ready to create amazing content
          </div>
          <div className="flex items-center space-x-4">
            <span>{wordCount} words</span>
            <span>•</span>
            <span>Auto-save enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextEditor;

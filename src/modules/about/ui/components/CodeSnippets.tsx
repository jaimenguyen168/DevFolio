import React from "react";
import { Eye, Star, User } from "lucide-react";
import CodeMirror, { oneDark } from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { EditorView } from "@uiw/react-codemirror";

const CodeSnippets = () => {
  const codeMirrorExtensions = [javascript(), EditorView.lineWrapping];

  return (
    <div className="p-6 flex-1 overflow-auto">
      <div className="mb-6">
        <span className="text-gray-400">// Code snippet showcase:</span>
      </div>

      <div className="space-y-6">
        {/* First Code Snippet */}
        <div className="bg-slate-800/50 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-400 font-medium">@username</span>
                  <span className="text-gray-400 text-sm">
                    Created 5 months ago
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-gray-400">
                <Eye size={16} />
                <span className="text-sm">details</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-400">
                <Star size={16} />
                <span className="text-sm">3 stars</span>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <CodeMirror
              value={`/**
 * Initializes a model chunk with parsed data and updates its status
 * @param chunk - The resolved model chunk to initialize
 * @returns The parsed value from the chunk
 */
function initializeModelChunk(chunk: ResolvedModelChunk): T {
  const value: T = parseModel(chunk._response, chunk._value);
  const initializedChunk: InitializedChunk<T> = (chunk: any);
  initializedChunk.status = INITIALIZED;
  initializedChunk.value = value;
  return value;
}`}
              theme={oneDark}
              extensions={codeMirrorExtensions}
              editable={false}
              basicSetup={{
                lineNumbers: true,
                foldGutter: false,
                dropCursor: false,
                allowMultipleSelections: false,
                indentOnInput: true,
                bracketMatching: true,
                closeBrackets: true,
                autocompletion: false,
                highlightSelectionMatches: false,
                searchKeymap: false,
              }}
              style={{
                fontSize: "12px",
                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
              }}
            />
          </div>
        </div>

        {/* Second Code Snippet */}
        <div className="bg-slate-800/50 rounded-lg border border-gray-700">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-400 font-medium">@username</span>
                  <span className="text-gray-400 text-sm">
                    Created 9 months ago
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-gray-400">
                <Eye size={16} />
                <span className="text-sm">details</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-400">
                <Star size={16} />
                <span className="text-sm">0 stars</span>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <CodeMirror
              value={`/**
 * Parses a model tuple from response data
 * @param response - The HTTP response object
 * @param value - The raw value to parse
 * @returns Processed model data
 */
export function parseModelTuple(response: Response, value: any): ParsedModel {
  const tuple: [mixed, mixed, mixed, mixed] = (value: any);
  return processModelData(tuple);
}`}
              theme={oneDark}
              extensions={codeMirrorExtensions}
              editable={false}
              basicSetup={{
                lineNumbers: true,
                foldGutter: false,
                dropCursor: false,
                allowMultipleSelections: false,
                indentOnInput: true,
                bracketMatching: true,
                closeBrackets: true,
                autocompletion: false,
                highlightSelectionMatches: false,
                searchKeymap: false,
              }}
              style={{
                fontSize: "12px",
                fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default CodeSnippets;

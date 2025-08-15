import React from 'react';
import { type GroundingChunk } from '../types';

interface ResultDisplayProps {
  query: string;
  answer: string;
  sources: GroundingChunk[];
  isLoading: boolean;
  error: string | null;
  imageUrl: string | null;
}

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center p-8">
    <div className="w-12 h-12 border-4 border-slate-700 border-t-cyan-400 rounded-full animate-spin"></div>
  </div>
);

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg" role="alert">
    <strong className="font-bold">Error: </strong>
    <span className="block sm:inline">{message}</span>
  </div>
);

const InitialState: React.FC = () => (
    <div className="text-center p-8 bg-slate-800/50 rounded-lg border border-slate-700">
        <h3 className="text-xl font-semibold text-slate-300">Ready to Research</h3>
        <p className="text-slate-400 mt-2">Enter a question above to get started. The AI will search the web to find the most current and relevant information for you.</p>
    </div>
);

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ query, answer, sources, isLoading, error, imageUrl }) => {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!answer) {
    return <InitialState />;
  }
  
  const formattedAnswer = answer.split('\n').map((line, index) => (
    <p key={index} className="mb-4 last:mb-0">{line}</p>
  ));

  return (
    <article className="bg-slate-800/50 rounded-lg p-6 md:p-8 border border-slate-700 animate-fade-in space-y-8">
      
      <header>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-100">
          {query}
        </h2>
      </header>
      
      {imageUrl && (
        <figure>
          <img 
            src={imageUrl} 
            alt={`AI generated image for: ${query}`}
            className="w-full h-auto rounded-lg shadow-lg border-2 border-slate-700" 
            aria-label={`AI generated image for: ${query}`}
          />
          <figcaption className="text-center text-sm text-slate-500 mt-2 italic">
            Figure 1: A visual interpretation of the research query.
          </figcaption>
        </figure>
      )}

      <section aria-labelledby="abstract-heading">
        <h3 id="abstract-heading" className="text-xl font-semibold text-cyan-400 mb-4 border-b-2 border-slate-700 pb-2">
          Abstract
        </h3>
        <div className="prose prose-invert prose-lg max-w-none text-slate-300">
          {formattedAnswer}
        </div>
      </section>

      {sources.length > 0 && (
        <section aria-labelledby="references-heading" className="pt-6 border-t border-slate-700">
          <h3 id="references-heading" className="text-xl font-semibold text-cyan-400 mb-4">References</h3>
          <ul className="space-y-4">
            {sources.map((source, index) => (
              <li key={index} className="flex items-start group">
                <span className="text-slate-500 mr-3 mt-1 font-mono group-hover:text-cyan-400 transition-colors">[{index + 1}]</span>
                <div>
                  <a
                    href={source.web.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors duration-200 font-medium"
                    title={source.web.uri}
                  >
                    {source.web.title || "Untitled Page"}
                  </a>
                  <p className="text-xs text-slate-500 break-all mt-1" aria-label="Source URL">{source.web.uri}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
};
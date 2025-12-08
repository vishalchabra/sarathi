import React from "react";

type Purpose = {
  material?: string;
  emotional?: string;
  spiritual?: string;
  combined?: string;
};

export default function PurposeCard({ purpose }: { purpose?: Purpose }) {
  if (!purpose) return null;

  return (
    <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 shadow-md rounded-2xl border border-gray-200 my-4 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-2xl font-semibold text-center text-indigo-700">
          Your Soul Path
        </h2>
      </div>

      <div className="p-4 space-y-5">
        {/* Material */}
        {purpose.material && (
          <section className="p-4 rounded-xl bg-gradient-to-r from-amber-100 to-yellow-50 border-l-4 border-amber-400 shadow-sm">
            <div className="flex items-center mb-1">
              <span className="mr-2">☀️</span>
              <h3 className="font-semibold text-amber-800">Material Purpose</h3>
            </div>
            <p className="text-sm text-gray-800 leading-relaxed">
              {purpose.material}
            </p>
          </section>
        )}

        {/* Emotional */}
        {purpose.emotional && (
          <section className="p-4 rounded-xl bg-gradient-to-r from-pink-100 to-rose-50 border-l-4 border-pink-400 shadow-sm">
            <div className="flex items-center mb-1">
              <span className="mr-2">💗</span>
              <h3 className="font-semibold text-pink-800">Emotional Purpose</h3>
            </div>
            <p className="text-sm text-gray-800 leading-relaxed">
              {purpose.emotional}
            </p>
          </section>
        )}

        {/* Spiritual */}
        {purpose.spiritual && (
          <section className="p-4 rounded-xl bg-gradient-to-r from-violet-100 to-indigo-50 border-l-4 border-violet-400 shadow-sm">
            <div className="flex items-center mb-1">
              <span className="mr-2">✨</span>
              <h3 className="font-semibold text-violet-800">Spiritual Purpose</h3>
            </div>
            <p className="text-sm text-gray-800 leading-relaxed">
              {purpose.spiritual}
            </p>
          </section>
        )}
      </div>
    </div>
  );
}

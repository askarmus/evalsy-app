export function StatsSection() {
  return (
    <div className="bg-white py-16 px-4 md:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg p-8 border border-gray-200 shadow-sm">
            <div className="text-5xl font-bold text-[#1a2e0d] mb-4">46%</div>
            <p className="text-gray-700">
              Companies using AI in their workflow process achieve more successful outcomes.
            </p>
            <div className="mt-4 flex items-center">
              <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <span className="ml-2 text-sm text-gray-500">Industry Research Group</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-8 border border-gray-200 shadow-sm">
            <div className="text-5xl font-bold text-[#1a2e0d] mb-4">20%</div>
            <p className="text-gray-700">
              More efficient workflow with AI-powered tools, helping businesses scale faster and smarter.
            </p>
            <div className="mt-4 flex items-center">
              <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <span className="ml-2 text-sm text-gray-500">Business Analytics Firm</span>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-[#1a2e0d] mb-6">How Our AI Solution Works</h2>
          <div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-video max-w-3xl mx-auto">
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1a2e0d"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

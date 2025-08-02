import { Target } from 'lucide-react';

export default function FeedbackCard({ data }: any) {
  return (
    <section aria-label="Feedback Card">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 bg-secondary-100 rounded-full p-2 flex items-center justify-center">
          <Target className="w-4 h-4 text-secondary-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Areas of improvement</h3>
      </div>
      <div className="p-2 w-full">
        <ul className="space-y-0">
          {data?.areasForImprovement?.map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="mt-2 w-2 h-2 rounded-full shrink-0 bg-secondary-400" />
              <span className="text-xs leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

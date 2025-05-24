export default function FeedbackCard({ data }: any) {
  console.log('FeedbackCard data:', data);
  return (
    <section aria-label="Feedback Card">
      <h2 className="text-lg font-semibold">Areas of improvement</h2>
      <div className="p-2 w-full">
        <ul className="space-y-0">
          {data?.areasForImprovement?.map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="mt-2 w-2 h-2 rounded-full shrink-0 bg-gray-400" />
              <span className="text-xs leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

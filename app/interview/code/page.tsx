import TerminalRunner from "@/components/shared/CodeRunner";
import MonacoEditor from "@/components/shared/CodeRunner";

export default function Code() {
  return (
    <main className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Monaco Editor in Next.js!</h1>
      <TerminalRunner />
    </main>
  );
}

export function getColorByInitial(name: string): string {
  if (!name) return "bg-gray-500 text-white"; // Default colors if name is missing

  const firstLetter = name.trim().charAt(0).toUpperCase();

  const colorMap: Record<string, string> = {
    A: "bg-red-500 text-white",
    B: "bg-blue-500 text-white",
    C: "bg-green-500 text-white",
    D: "bg-yellow-500 text-black",
    E: "bg-purple-500 text-white",
    F: "bg-pink-500 text-white",
    G: "bg-indigo-500 text-white",
    H: "bg-teal-500 text-white",
    I: "bg-orange-500 text-black",
    J: "bg-cyan-500 text-black",
    K: "bg-lime-500 text-black",
    L: "bg-amber-500 text-black",
    M: "bg-rose-500 text-white",
    N: "bg-violet-500 text-white",
    O: "bg-fuchsia-500 text-white",
    P: "bg-emerald-500 text-white",
    Q: "bg-sky-500 text-black",
    R: "bg-slate-500 text-white",
    S: "bg-zinc-500 text-white",
    T: "bg-stone-500 text-white",
    U: "bg-lime-700 text-white",
    V: "bg-indigo-700 text-white",
    W: "bg-red-700 text-white",
    X: "bg-blue-700 text-white",
    Y: "bg-green-700 text-white",
    Z: "bg-yellow-700 text-black",
  };

  return colorMap[firstLetter] || "bg-gray-500 text-white"; // Default to gray with white text if letter not found
}

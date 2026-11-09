export default function CustomerAvatar({ initials, size = "default" }) {
  const sizeClass = size === "large" ? "h-12 w-12 text-base" : "h-9 w-9 text-xs";

  return (
    <span className={`flex shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700 ${sizeClass}`}>
      {initials}
    </span>
  );
}

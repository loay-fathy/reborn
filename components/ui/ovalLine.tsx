export default function OvalLine({ className }: { className?: string }) {
  return (
    <div
      className={`w-full h-1 opacity-25 bg-[radial-gradient(ellipse_at_center,#432C2C,#501C1C00,transparent_100%)] ${className}`}
    ></div>
  );
}

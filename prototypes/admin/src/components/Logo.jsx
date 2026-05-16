export default function Logo({ className = "w-32", variant = "white" }) {
  const src = variant === "red" ? "/Logo-Red.svg" : "/Logo-White.svg";
  return (
    <img src={src} alt="عتاد" className={className} />
  );
}

export function Avatar({ className, children }) {
    return <div className={`w-16 h-16 rounded-full border ${className}`}>{children}</div>;
  }
  
  export function AvatarImage({ src, alt, className }) {
    return <img src={src} alt={alt} className={`w-full h-full rounded-full ${className}`} />;
  }
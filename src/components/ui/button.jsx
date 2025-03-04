export function Button({ children, className, ...props }) {
    return <button className={`bg-blue-500 text-white p-2 rounded-lg ${className}`} {...props}>{children}</button>;
  }
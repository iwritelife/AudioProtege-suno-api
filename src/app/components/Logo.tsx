

export default function Logo({ className = '', ...props }) {
  return (
    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-2 shadow-lg">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={className}
        fill="none" stroke="#ffffff" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    </span>
  );
}

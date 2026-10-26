function Section({ className = "", padded = true, children, ...props }) {
  return (
    <section
      className={`${padded ? "py-12.5" : ""} ${className}`.trim()}
      {...props}
    >
      {children}
    </section>
  );
}

export default Section;

function Section({ className = "", padded = true, children, ...props }) {
  return (
    <section
      className={`${padded ? "py-16 md:py-20" : ""} ${className}`.trim()}
      {...props}
    >
      {children}
    </section>
  );
}

export default Section;

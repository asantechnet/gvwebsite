function SectionHeading({ id, titleBefore, titleHighlight, className = "" }) {
  return (
    <h2
      id={id}
      className={`font-heading text-xl font-extrabold leading-tight text-foreground dark:text-gray-50 sm:text-2xl lg:text-3xl ${className}`.trim()}
    >
      {titleBefore}{" "}
      <span className="text-primary">{titleHighlight}</span>
    </h2>
  );
}

export default SectionHeading;

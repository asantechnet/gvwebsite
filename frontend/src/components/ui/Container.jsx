function Container({ as: Component = "div", className = "", children, ...props }) {
  return (
    <Component
      className={`mx-auto w-full max-w-7xl px-4 sm:px-6 xl:px-8 ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}

export default Container;

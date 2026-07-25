export const createElement = (type, props = {}, ...children) => {
  const isFragment = type === "FRAG";
  const element = isFragment
    ? document.createDocumentFragment()
    : document.createElement(type);

  const validProps = !isFragment && props ? props : {};
  for (const key in validProps) {
    if (key.startsWith("on")) {
      element.addEventListener(key.slice(2).toLowerCase(), props[key]);
    } else if (key === "classes") {
      element.classList.add(...props[key]);
    } else {
      element.setAttribute(key, props[key]);
    }
  }

  children.flat().forEach((child) => {
    if (child) {
      element.appendChild(
        typeof child === "string" ? document.createTextNode(child) : child,
      );
    }
  });

  return element;
};

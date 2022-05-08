/*
@param {String} el
@param {String} classNames
@param {HTMLElement} child
@param {HTMLElement} parent
@param {...array} dataAttr
*/
export default function create(el, classNames, child, parent, ...dataAttr) {
  let element = null;
  // попробуй выполнить, если ошибка выдай в error
  try {
    element = document.createElement(el);
  } catch (error) {
    throw new Error('Error in creating');
  }
  if (classNames) {
    element.classList.add(...classNames.split(' ')); // значит высыпать массив
  }
  if (child && Array.isArray(child)) {
    child.forEach((childElement) => childElement && element.appendChild(childElement));
  } else if (child && typeof child === 'object') {
    element.appendChild(child);
  } else if (child && typeof child === 'string') {
    element.innerHTML = child;
  }

  if (parent) {
    parent.appendChild(element);
  }
  if (dataAttr.length) {
    dataAttr.forEach(([attrName, attrValue]) => {
      if (attrValue === '') {
        element.setAttribute(attrName, '');
      } else if (attrName.match(/value|id|placeholder|autocorrect|cols|rows|spellcheck/)) {
        element.setAttribute(attrName, attrValue);
      } else {
        element.dataset[attrName] = attrValue;
      }
    });
  }
  return element;
}

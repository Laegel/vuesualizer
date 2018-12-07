export default function setStyles(target: any, properties: any) {
  for (const prop in properties) {
    if (properties.hasOwnProperty(prop)) {
      target.style[prop] = properties[prop];
    }
  }
}

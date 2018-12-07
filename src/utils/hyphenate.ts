// Taken from Vue's hyphenate function
const hyphenateRE = /\B([A-Z])/g;
export default (str: string): string => {
  return str.replace(hyphenateRE, '-$1').toLowerCase();
};

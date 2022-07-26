export function convertHTML(value) {
  const div = document.createElement('div');
  div.innerHTML = value;
  return div.innerText;
}

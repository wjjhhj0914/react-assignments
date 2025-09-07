// 초점 이동 가능한 요소 셀렉터
const focusableSelector =
  'a[href], area[href], button, input, select, textarea, iframe, summary, details [tabindex] video[controls], audio[controls], [contenteditable=""], [contenteditable="true"]'

export default function getFocusableElements(container: HTMLElement) {
  const elements: HTMLElement[] = Array.from(
    container.querySelectorAll(focusableSelector)
  )

  return elements.filter(
    (el) =>
      !el.hasAttribute('disabled') &&
      el.tabIndex !== -1 &&
      el.offsetParent !== null
  )
}

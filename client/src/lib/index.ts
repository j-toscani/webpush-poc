export function mergeCN(...args: Array<string | undefined>): string {
  return args.filter(Boolean).join(' ')
}

export function clearForm(node: EventTarget) {
  if (node instanceof HTMLFormElement) {
    node.reset()
  }
}
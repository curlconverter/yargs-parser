/**
 * @license
 * Copyright (c) 2016, Contributors
 * SPDX-License-Identifier: ISC
 */

// take an un-split argv string and tokenize it.
export function tokenizeArgString (argString: string | any[]): string[] {
  if (Array.isArray(argString)) {
    return argString.map(e => typeof e !== 'string' ? e + '' : e)
  }

  argString = argString.trim()

  let i = 0
  let prevC: string | null = null
  let c: string | null = null
  let opening: string | null = null
  const args: string[] = []

  for (let ii = 0; ii < argString.length; ii++) {
    prevC = c
    c = argString.charAt(ii)

    // split on spaces unless we're in quotes.
    if (c === ' ' && !opening) {
      if (!(prevC === ' ')) {
        i++
      }
      continue
    }

    // don't split the string if we're in matching
    // opening or closing single and double quotes.
    let escaped = false
    if (ii > 0) {
      const previousCharacterIndex = ii - 1
      const previousCharacter = argString.charAt(previousCharacterIndex)
      escaped = previousCharacter === '\\'
    }
    if (c === opening && !escaped) {
      opening = null
      continue
    } else if ((c === "'" || c === '"') && !opening) {
      opening = c
      if (!args[i])
        args[i] = '';
      continue
    }
    // only include slashes if they are not escaping the quotes we're
    // currently inside
    let nextCharacter = null
    if (ii < argString.length - 1) {
      nextCharacter = argString.charAt(ii + 1)
    }
    if (c === '\\' && nextCharacter === opening) {
      continue
    }

    if (!args[i]) args[i] = ''
    args[i] += c
  }

  return args
}

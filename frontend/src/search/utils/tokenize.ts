/// <reference path='../Search.d.ts' />

let counter;

export function tokenize(text: string, config: SearchConfig): Token[] {
  let tokens: Token[] = [];
  let mem = '';

  counter = 0;

  for (let i = 0; i <= text.length; i++) {
    const character = text[i];

    if (character === ' ' || !character) {
      if (mem) {
        tokens.push(createToken(mem, config));
      }
      if (character) {
        tokens.push(createToken(null, config));
      }
      mem = '';
    } else if (character !== ' ') {
      mem += character;
    }

    if (character === ':' && text[i + 1] === ' ') {
      mem += ' ';
      i += 1;
    }
  }
  return tokens;
}

export function createToken(text: string, config: SearchConfig = {}) {
  if (!text || text === ' ') {
    return {
      key: 'token-' + counter++,
      modifier: '',
      value: ' ',
      type: 'space',
      length: 1,
    };
  }

  const modifier = getModifier(text, config);

  const value = modifier ? text.substr(modifier.length) : text;
  const type = modifier ? config[modifier].type : config['_default'].type;
  const length = modifier ? modifier.length + value.length : value.length;

  return {
    key: 'token-' + counter++,
    modifier: modifier,
    value: value,
    type: type,
    length: length,
  };
}

export function getModifier(text: string, config: SearchConfig) {
  if (text.substr(0, 1) === '+') {
    return '+';
  }

  for (let modifier in config) {
    if (text.substr(0, modifier.length) === modifier) {
      return modifier;
    }
  }

  return null;
}

const modifier = (text) => {

  let output = text;

  // clear state
  state.message = undefined;
  state.preventOutput = false;

  if (text.startsWith('\n/') || text.startsWith('\n> You /') || text.startsWith('\n> You say "/')) {

    const currentEntries = worldEntries.flatMap(e => e.keys.split(', '));
    const input = text.slice(text.indexOf('/') + 1).split('"').map(e => e.trim());

    // account for 'Do' command appending a '.'
    if (input[0].endsWith('.')) input[0] = input[0].slice(0, input[0].length - 1);

    // prevent output
    state.preventOutput = true;
    output = '';

    switch (input[0]) {
      case 'listKeys':
        state.message = 'listKeys';
        break;
      case 'showKey':
        state.message = 'showKey';
        break;
      case 'addKey':
        state.message = 'addKey';
        break;
      case 'removeKey':
        state.message = 'removeKey';
        break;
      case 'modKey':
        state.message = 'modKey';
        break;
      case 'appendKey':
        state.message = 'appendKey';
        break;
      case 'aliasKey':
        state.message = 'aliasKey';
        break;
      default:
        state.message = 'default';
    }
  }

  return {text: output};
}
modifier(text);

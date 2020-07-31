const modifier = (text) => {

  let output = text;

  // clear state
  state.message = undefined;
  state.preventOutput = false;

  if (text.startsWith('\n/') || text.startsWith('\n> You /') || text.startsWith('\n> You say "/')) {

    const currentEntries = worldEntries.flatMap(e => e.keys.split(', '));
    const input = text.slice(text.indexOf('/') + 1).split('"');

    input[0] = input[0].split(' ')[0]; // make sure command is one word, for more relevant error messages
    if (input[0].endsWith('.')) input[0] = input[0].slice(0, input[0].length - 1); // account for 'Do' command appending a '.'

    // prevent output
    state.preventOutput = true;
    output = '';

    switch (input[0]) {
      case 'listKeys':
        state.message = 'Current Keys:\n\n' + worldEntries.map(e => '(' + e.keys + ')').join(', ');
        break;
      case 'showKey':
        if (!input[1]) state.message = 'Usage: /showKey "<key>"';
        else if (!currentEntries.includes(input[1])) state.message = 'Key "' + input[1] + '" does not exist!';
        else state.message = input[1] + ':\n\n' + worldEntries.filter(e => e.keys.includes(input[1])).map(e => e.entry).join('\n\n');
        break;
      case 'addKey':
        if (!input[1] || !input[2]) state.message = 'Usage: /addKey "<key>" entry';
        else if (currentEntries.includes(input[1])) state.message = 'Key "' + input[1] + '" already exists! Use /modKey or /appendKey instead.';
        else {
          let entry = input.filter((e,i) => i > 1).join('"').trim();
          addWorldEntry(input[1], entry);
          state.message = input[1] + ':\n\n' + entry;
        }
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

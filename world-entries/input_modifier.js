const modifier = (text) => {

  let output = text;

  // clear state
  state.message = undefined;
  state.preventOutput = false;

  if (text.startsWith('\n/') || text.startsWith('\n> You /') || text.startsWith('\n> You say "/')) {

    const currentEntries = worldEntries.flatMap(e => e.keys.split(', '));
    const input = text.slice(text.indexOf('/') + 1).split('"');

    input[0] = input[0].split(' ')[0].trim(); // make sure command is one word, for more relevant error messages
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
        if (!input[1]) state.message = 'Usage: /removeKey "<key>"';
        else if (!currentEntries.includes(input[1])) state.message = 'Key "' + input[1] + '" does not exist!';
        else {
          let entryCount = 0;
          worldEntries.forEach((e, i) => {
            if (e.keys.includes(input[1])) {
              entryCount++;
              if (entryCount === 1) {
                if (e.keys === input[1]) removeWorldEntry(i);
                else if (e.keys.startsWith(input[1])) updateWorldEntry(i, e.keys.replace(input[1] + ', ', ''), e.entry);
                else if (e.keys.includes(input[1])) updateWorldEntry(i, e.keys.replace(', ' + input[1], ''), e.entry);
              }
            }
          });
          state.message = 'Key "' + input[1] + '" removed.';
          if (entryCount > 1) state.message = 'WARNING: Multiple entries with key "' + input[1] + '". Only removed first.\n\n' + state.message;
        }
        break;
      case 'modKey':
        if (!input[1] || !input[2]) state.message = 'Usage: /modKey "<key>" entry';
        else if (!currentEntries.includes(input[1])) state.message = 'Key "' + input[1] + '" does not exist! Use /addKey instead.';
        else {
          let entry = input.filter((e,i) => i > 1).join('"').trim();
          let entryCount = 0;
          worldEntries.forEach((e, i) => {
            if (e.keys.includes(input[1])) {
              entryCount++;
              if (entryCount === 1) updateWorldEntry(i, e.keys, entry);
            }
          });
          state.message = input[1] + ':\n\n' + entry;
          if (entryCount > 1) state.message = 'WARNING: Multiple entries with key "' + input[1] + '". Only modified first.\n\n' + state.message;
        }
        break;
      case 'appendKey':
        state.message = 'appendKey';
        break;
      case 'aliasKey':
        state.message = 'aliasKey';
        break;
      default:
        state.message = 'default:\n' + JSON.stringify(input);
    }
  }

  return {text: output};
}
modifier(text);

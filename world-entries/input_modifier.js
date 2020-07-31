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
        if (!input[1] || !input[2]) state.message = 'Usage: /addKey "<key>" <entry>';
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
        if (!input[1] || !input[2]) state.message = 'Usage: /modKey "<key>" <entry>';
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
        if (!input[1] || !input[2]) state.message = 'Usage: /appendKey "<key>" <addendum>';
        else if (!currentEntries.includes(input[1])) state.message = 'Key "' + input[1] + '" does not exist! Use /addKey instead.';
        else {
          let entry;
          let entryCount = 0;
          worldEntries.forEach((e, i) => {
            if (e.keys.includes(input[1])) {
              entryCount++;
              if (entryCount === 1) {
                entry = e.entry + '\n' + input.filter((e,i) => i > 1).join('"').trim();
                updateWorldEntry(i, e.keys, entry);
              }
            }
          });
          state.message = input[1] + ':\n\n' + entry;
          if (entryCount > 1) state.message = 'WARNING: Multiple entries with key "' + input[1] + '". Only appended to first.\n\n' + state.message;
        }
        break;
      case 'aliasKey':
        if (!input[1] || !input[3]) state.message = 'Usage: /aliasKey "<key>" "<alias>"';
        else if (!currentEntries.includes(input[1])) state.message = 'Key "' + input[1] + '" does not exist!';
        else if (currentEntries.includes(input[3])) state.message = 'Key "' + input[3] + '" already exist!';
        else {
          let entryCount = 0;
          worldEntries.forEach((e, i) => {
            if (e.keys.includes(input[1])) {
              entryCount++;
              if (entryCount === 1) {
                updateWorldEntry(i, e.keys + ', ' + input[3], e.entry);
              }
            }
          });
          state.message = 'Alias "' + input[3] + '" added for key "' + input[1] + '".'
          if (entryCount > 1) state.message = 'WARNING: Multiple entries with key "' + input[1] + '". Only aliased first.\n\n' + state.message;
        }
        break;
      default:
        state.message = 'Available Commands:' + '\n\n' +
                        '/listKeys\nShow currently stored sets of keys.\n\n' +
                        '/showKey "<key>"\nShow entry stored for <key>.\n\n' +
                        '/addKey "<key>" <entry>\nStore <entry> under new key <key>.\n\n' +
                        '/removeKey "<key>"\nRemove <key> (if there are other keys for the entry, they will remain).\n\n' +
                        '/modKey "<key>" <entry>\nReplace entry stored at <key> with <entry>.\n\n' +
                        '/appendKey "<key>" <addendum>\nAdd <addendum> to the end of the entry stored at <key>.\n\n' +
                        '/aliasKey "<key>" "<alias>"\nAdd <alias> as an additional key for the entry stored at <key>.\n\n';
    }
  }

  return {text: output};
}
modifier(text);

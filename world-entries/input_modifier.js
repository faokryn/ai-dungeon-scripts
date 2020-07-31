const modifier = (text) => {

  let output = text;

  // clear state
  state.message = undefined;
  state.preventOutput = false;

  if (text.startsWith('\n/') || text.startsWith('\n> You /') || text.startsWith('\n> You say "/')) {

    const input = text.slice(text.indexOf('/') + 1).split('"');
    const currentEntries = worldEntries.flatMap(e => e.keys.split(', '));

    // prevent output
    state.preventOutput = true;
    output = '';

    state.message = JSON.stringify(currentEntries);
  }

  return {text: output};
}
modifier(text);

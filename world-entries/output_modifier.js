const modifier = (text) => {
  if (state.preventOutput) text = '';
  return {text: text};
}
modifier(text);

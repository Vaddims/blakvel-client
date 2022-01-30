function extendedEncodeURIComponent (string: string) {
  return encodeURIComponent(string).replace(/[!'()*]/g, function(character: string) {
    return '%' + character.charCodeAt(0).toString(16);
  });
}

export default extendedEncodeURIComponent;
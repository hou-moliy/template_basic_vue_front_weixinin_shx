const formatRichText = (html) => {
  let newContent = html.replace(/<img[^>]*>/gi, function (match, capture) {
    match = match.replace(/style="[^"]+"/gi, "").replace(/style='[^']+'/gi, "");
    match = match.replace(/width="[^"]+"/gi, "").replace(/width='[^']+'/gi, "");
    match = match.replace(/height="[^"]+"/gi, "").replace(/height='[^']+'/gi, "");
    return match;
  });
  newContent = newContent.replace(/\\<img/gi, "<img style=\"max-width:100%;height:auto;\"");
  return newContent;
};
module.exports = {
  formatRichText,
};

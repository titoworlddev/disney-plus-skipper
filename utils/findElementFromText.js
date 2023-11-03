/**
 * @param {String | String[]} texts
 */
export const findElementFromText = texts => {
  // var xpathExpression =
  //   "//*[contains(text(), 'SALTAR RESUMEN') or contains(text(), 'SALTAR INTRO')]";
  let xpathExpression = `//*[contains(text(), '${texts}')]`;

  if (Array.isArray(texts)) {
    xpathExpression = '//*[contains(text(), ';
    texts.map((text, index) => {
      index === texts.length - 1
        ? (xpathExpression += `'${text}')]`)
        : (xpathExpression += `'${text}') or contains(text(), `);
    });
  }

  const result = document.evaluate(
    xpathExpression,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  );

  return result.singleNodeValue;
};

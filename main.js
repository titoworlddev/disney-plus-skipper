/**
 * @param {String | String[]} texts
 */
const findElementFromText = texts => {
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

setInterval(() => {
  const skipperCheckbox = document.querySelector('#skipper-active');
  if (skipperCheckbox.checked) {
    const skipIntroResumeBtn = findElementFromText([
      'SALTAR RESUMEN',
      'SALTAR INTRO'
    ]);
    if (skipIntroResumeBtn) skipIntroResumeBtn.click();
  }
}, 1000);

const fs = require('fs-extra');

function escapeXml(string_) {
  if (typeof string_ !== 'string') {
    return String(string_);
  }
  return string_.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll("'", '&apos;');
}

function indentFileContent(content) {
  if (typeof content !== 'string') {
    return String(content);
  }
  return content.split('\n').map((line) => `    ${line}`);
}

function generateXMLOutput(aggregatedContent, outputPath) {
  const { textFiles } = aggregatedContent;
  const writeStream = fs.createWriteStream(outputPath, { encoding: 'utf8' });

  return new Promise((resolve, reject) => {
    writeStream.on('error', reject);
    writeStream.on('finish', resolve);

    writeStream.write('<?xml version="1.0" encoding="UTF-8"?>\n');
    writeStream.write('<files>\n');

    // Sort files by path for deterministic order
    const filesSorted = [...textFiles].sort((a, b) => a.path.localeCompare(b.path));
    let index = 0;

    const writeNext = () => {
      if (index >= filesSorted.length) {
        writeStream.write('</files>\n');
        writeStream.end();
        return;
      }

      const file = filesSorted[index++];
      const p = escapeXml(file.path);
      const content = typeof file.content === 'string' ? file.content : '';

      if (content.length === 0) {
        writeStream.write(`\t<file path='${p}'/>\n`);
        setTimeout(writeNext, 0);
        return;
      }

      const needsCdata = content.includes('<') || content.includes('&') || content.includes(']]>');
      if (needsCdata) {
        // Open tag and CDATA on their own line with tab indent; content lines indented with two tabs
        writeStream.write(`\t<file path='${p}'><![CDATA[\n`);
        // Safely split any occurrences of "]]>" inside content, trim trailing newlines, indent each line with two tabs
        const safe = content.replaceAll(']]>', ']]]]><![CDATA[>');
        const trimmed = safe.replace(/[\r\n]+$/, '');
        const indented =
          trimmed.length > 0
            ? trimmed
                .split('\n')
                .map((line) => `\t\t${line}`)
                .join('\n')
            : '';
        writeStream.write(indented);
        // Close CDATA and attach closing tag directly after the last content line
        writeStream.write(']]></file>\n');
      } else {
        // Write opening tag then newline; indent content with two tabs; attach closing tag directly after last content char
        writeStream.write(`\t<file path='${p}'>\n`);
        const trimmed = content.replace(/[\r\n]+$/, '');
        const indented =
          trimmed.length > 0
            ? trimmed
                .split('\n')
                .map((line) => `\t\t${line}`)
                .join('\n')
            : '';
        writeStream.write(indented);
        writeStream.write(`</file>\n`);
      }

      setTimeout(writeNext, 0);
    };

    writeNext();
  });
}

module.exports = { generateXMLOutput };

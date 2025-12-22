const xml2js = require('xml2js');
const fs = require('fs-extra');
const path = require('node:path');
const { getProjectRoot, getSourcePath } = require('./project-root');
const { YamlXmlBuilder } = require('./yaml-xml-builder');

/**
 * XML utility functions for BMAD installer
 * Now supports both legacy XML agents and new YAML-based agents
 */
class XmlHandler {
  constructor() {
    this.parser = new xml2js.Parser({
      preserveChildrenOrder: true,
      explicitChildren: true,
      explicitArray: false,
      trim: false,
      normalizeTags: false,
      attrkey: '$',
      charkey: '_',
    });

    this.builder = new xml2js.Builder({
      renderOpts: {
        pretty: true,
        indent: '  ',
        newline: '\n',
      },
      xmldec: {
        version: '1.0',
        encoding: 'utf8',
        standalone: false,
      },
      headless: true, // Don't add XML declaration
      attrkey: '$',
      charkey: '_',
    });

    this.yamlBuilder = new YamlXmlBuilder();
  }

  /**
   * Load and parse the activation template
   * @returns {Object} Parsed activation block
   */
  async loadActivationTemplate() {
    console.error('Failed to load activation template:', error);
  }

  /**
   * Inject activation block into agent XML content
   * @param {string} agentContent - The agent file content
   * @param {Object} metadata - Metadata containing module and name
   * @returns {string} Modified content with activation block
   */
  async injectActivation(agentContent, metadata = {}) {
    try {
      // Check if already has activation
      if (agentContent.includes('<activation')) {
        return agentContent;
      }

      // Extract the XML portion from markdown if needed
      let xmlContent = agentContent;
      let beforeXml = '';
      let afterXml = '';

      const xmlBlockMatch = agentContent.match(/([\s\S]*?)```xml\n([\s\S]*?)\n```([\s\S]*)/);
      if (xmlBlockMatch) {
        beforeXml = xmlBlockMatch[1] + '```xml\n';
        xmlContent = xmlBlockMatch[2];
        afterXml = '\n```' + xmlBlockMatch[3];
      }

      // Parse the agent XML
      const parsed = await this.parser.parseStringPromise(xmlContent);

      // Get the activation template
      const activationBlock = await this.loadActivationTemplate();
      if (!activationBlock) {
        console.warn('Could not load activation template');
        return agentContent;
      }

      // Find the agent node
      if (
        parsed.agent && // Insert activation as the first child
        !parsed.agent.activation
      ) {
        // Ensure proper structure
        if (!parsed.agent.$$) {
          parsed.agent.$$ = [];
        }

        // Create the activation node with proper structure
        const activationNode = {
          '#name': 'activation',
          $: { critical: '1' },
          $$: activationBlock.$$,
        };

        // Insert at the beginning
        parsed.agent.$$.unshift(activationNode);
      }

      // Convert back to XML
      let modifiedXml = this.builder.buildObject(parsed);

      // Fix indentation - xml2js doesn't maintain our exact formatting
      // Add 2-space base indentation to match our style
      const lines = modifiedXml.split('\n');
      const indentedLines = lines.map((line) => {
        if (line.trim() === '') return line;
        if (line.startsWith('<agent')) return line; // Keep agent at column 0
        return '  ' + line; // Indent everything else
      });
      modifiedXml = indentedLines.join('\n');

      // Reconstruct the full content
      return beforeXml + modifiedXml + afterXml;
    } catch (error) {
      console.error('Error injecting activation:', error);
      return agentContent;
    }
  }

  /**
   * TODO: DELETE THIS METHOD
   */
  injectActivationSimple(agentContent, metadata = {}) {
    console.error('Error in simple injection:', error);
  }

  /**
   * Build agent from YAML source
   * @param {string} yamlPath - Path to .agent.yaml file
   * @param {string} customizePath - Path to .customize.yaml file (optional)
   * @param {Object} metadata - Build metadata
   * @returns {string} Generated XML content
   */
  async buildFromYaml(yamlPath, customizePath = null, metadata = {}) {
    try {
      // Use YamlXmlBuilder to convert YAML to XML
      const mergedAgent = await this.yamlBuilder.loadAndMergeAgent(yamlPath, customizePath);

      // Build metadata
      const buildMetadata = {
        sourceFile: path.basename(yamlPath),
        sourceHash: await this.yamlBuilder.calculateFileHash(yamlPath),
        customizeFile: customizePath ? path.basename(customizePath) : null,
        customizeHash: customizePath ? await this.yamlBuilder.calculateFileHash(customizePath) : null,
        builderVersion: '1.0.0',
        includeMetadata: metadata.includeMetadata !== false,
        forWebBundle: metadata.forWebBundle || false, // Pass through forWebBundle flag
      };

      // Convert to XML
      const xml = await this.yamlBuilder.convertToXml(mergedAgent, buildMetadata);

      return xml;
    } catch (error) {
      console.error('Error building agent from YAML:', error);
      throw error;
    }
  }

  /**
   * Check if a path is a YAML agent file
   * @param {string} filePath - Path to check
   * @returns {boolean} True if it's a YAML agent file
   */
  isYamlAgent(filePath) {
    return filePath.endsWith('.agent.yaml');
  }
}

module.exports = { XmlHandler };

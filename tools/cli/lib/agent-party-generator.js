const path = require('node:path');
const fs = require('fs-extra');
const { escapeXml } = require('../../lib/xml-utils');

const AgentPartyGenerator = {
  /**
   * Generate agent-manifest.csv content
   * @param {Array} agentDetails - Array of agent details
   * @param {Object} options - Generation options
   * @returns {string} XML content
   */
  generateAgentParty(agentDetails, options = {}) {
    const { forWeb = false } = options;

    // Group agents by module
    const agentsByModule = {
      bmm: [],
      cis: [],
      core: [],
      custom: [],
    };

    for (const agent of agentDetails) {
      const moduleKey = agentsByModule[agent.module] ? agent.module : 'custom';
      agentsByModule[moduleKey].push(agent);
    }

    // Build XML content
    let xmlContent = `<!-- Powered by BMAD-CORE™ -->
<!-- Agent Manifest - Generated during BMAD ${forWeb ? 'bundling' : 'installation'} -->
<!-- This file contains a summary of all ${forWeb ? 'bundled' : 'installed'} agents for quick reference -->
<manifest id="bmad/_config/agent-manifest.csv" version="1.0" generated="${new Date().toISOString()}">
  <description>
    Complete roster of ${forWeb ? 'bundled' : 'installed'} BMAD agents with summarized personas for efficient multi-agent orchestration.
    Used by party-mode and other multi-agent coordination features.
  </description>
`;

    // Add agents by module
    for (const [module, agents] of Object.entries(agentsByModule)) {
      if (agents.length === 0) continue;

      const moduleTitle =
        module === 'bmm' ? 'BMM Module' : module === 'cis' ? 'CIS Module' : module === 'core' ? 'Core Module' : 'Custom Module';

      xmlContent += `\n  <!-- ${moduleTitle} Agents -->\n`;

      for (const agent of agents) {
        xmlContent += `  <agent id="${agent.id}" name="${agent.name}" title="${agent.title || ''}" icon="${agent.icon || ''}">
    <persona>
      <role>${escapeXml(agent.role || '')}</role>
      <identity>${escapeXml(agent.identity || '')}</identity>
      <communication_style>${escapeXml(agent.communicationStyle || '')}</communication_style>
      <principles>${agent.principles || ''}</principles>
    </persona>
  </agent>\n`;
      }
    }

    // Add statistics
    const totalAgents = agentDetails.length;
    const moduleList = Object.keys(agentsByModule)
      .filter((m) => agentsByModule[m].length > 0)
      .join(', ');

    xmlContent += `\n  <statistics>
    <total_agents>${totalAgents}</total_agents>
    <modules>${moduleList}</modules>
    <last_updated>${new Date().toISOString()}</last_updated>
  </statistics>
</manifest>`;

    return xmlContent;
  },

  /**
   * Extract agent details from XML content
   * @param {string} content - Full agent file content (markdown with XML)
   * @param {string} moduleName - Module name
   * @param {string} agentName - Agent name
   * @returns {Object} Agent details
   */
  extractAgentDetails(content, moduleName, agentName) {
    try {
      // Extract agent XML block
      const agentMatch = content.match(/<agent[^>]*>([\s\S]*?)<\/agent>/);
      if (!agentMatch) return null;

      const agentXml = agentMatch[0];

      // Extract attributes from opening tag
      const nameMatch = agentXml.match(/name="([^"]*)"/);
      const titleMatch = agentXml.match(/title="([^"]*)"/);
      const iconMatch = agentXml.match(/icon="([^"]*)"/);

      // Extract persona elements - now we just copy them as-is
      const roleMatch = agentXml.match(/<role>([\s\S]*?)<\/role>/);
      const identityMatch = agentXml.match(/<identity>([\s\S]*?)<\/identity>/);
      const styleMatch = agentXml.match(/<communication_style>([\s\S]*?)<\/communication_style>/);
      const principlesMatch = agentXml.match(/<principles>([\s\S]*?)<\/principles>/);

      return {
        id: `bmad/${moduleName}/agents/${agentName}.md`,
        name: nameMatch ? nameMatch[1] : agentName,
        title: titleMatch ? titleMatch[1] : 'Agent',
        icon: iconMatch ? iconMatch[1] : '🤖',
        module: moduleName,
        role: roleMatch ? roleMatch[1].trim() : '',
        identity: identityMatch ? identityMatch[1].trim() : '',
        communicationStyle: styleMatch ? styleMatch[1].trim() : '',
        principles: principlesMatch ? principlesMatch[1].trim() : '',
      };
    } catch (error) {
      console.error(`Error extracting details for agent ${agentName}:`, error);
      return null;
    }
  },

  /**
   * Extract attribute from XML tag
   */
  extractAttribute(xml, tagName, attrName) {
    const regex = new RegExp(`<${tagName}[^>]*\\s${attrName}="([^"]*)"`, 'i');
    const match = xml.match(regex);
    return match ? match[1] : '';
  },

  /**
   * Apply config overrides to agent details
   * @param {Object} details - Original agent details
   * @param {string} configContent - Config file content
   * @returns {Object} Agent details with overrides applied
   */
  applyConfigOverrides(details, configContent) {
    try {
      // Extract agent-config XML block
      const configMatch = configContent.match(/<agent-config>([\s\S]*?)<\/agent-config>/);
      if (!configMatch) return details;

      const configXml = configMatch[0];

      // Extract override values
      const nameMatch = configXml.match(/<name>([\s\S]*?)<\/name>/);
      const titleMatch = configXml.match(/<title>([\s\S]*?)<\/title>/);
      const roleMatch = configXml.match(/<role>([\s\S]*?)<\/role>/);
      const identityMatch = configXml.match(/<identity>([\s\S]*?)<\/identity>/);
      const styleMatch = configXml.match(/<communication_style>([\s\S]*?)<\/communication_style>/);
      const principlesMatch = configXml.match(/<principles>([\s\S]*?)<\/principles>/);

      // Apply overrides only if values are non-empty
      if (nameMatch && nameMatch[1].trim()) {
        details.name = nameMatch[1].trim();
      }

      if (titleMatch && titleMatch[1].trim()) {
        details.title = titleMatch[1].trim();
      }

      if (roleMatch && roleMatch[1].trim()) {
        details.role = roleMatch[1].trim();
      }

      if (identityMatch && identityMatch[1].trim()) {
        details.identity = identityMatch[1].trim();
      }

      if (styleMatch && styleMatch[1].trim()) {
        details.communicationStyle = styleMatch[1].trim();
      }

      if (principlesMatch && principlesMatch[1].trim()) {
        // Principles are now just copied as-is (narrative paragraph)
        details.principles = principlesMatch[1].trim();
      }

      return details;
    } catch (error) {
      console.error(`Error applying config overrides:`, error);
      return details;
    }
  },

  /**
   * Write agent-manifest.csv to file
   */
  async writeAgentParty(filePath, agentDetails, options = {}) {
    const content = this.generateAgentParty(agentDetails, options);
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, content, 'utf8');
    return content;
  },
};

module.exports = { AgentPartyGenerator };

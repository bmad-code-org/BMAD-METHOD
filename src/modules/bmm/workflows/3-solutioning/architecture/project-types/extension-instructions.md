# Browser/Editor Extension Architecture Instructions

## Intent-Based Technical Decision Guidance

<critical>
This is a STARTING POINT for extension architecture decisions.
The LLM should:
- Understand the host platform (browser, VS Code, IDE, etc.)
- Focus on extension-specific constraints and APIs
- Consider distribution through official stores
- Balance functionality with performance impact
- Plan for permission models and security
</critical>

## Extension Type and Platform

**Identify Target Platform**

- **Browser**: Chrome, Firefox, Safari, Edge
- **VS Code**: Most popular code editor
- **JetBrains IDEs**: IntelliJ, WebStorm, etc.
- **Other Editors**: Sublime, Atom, Vim, Emacs
- **Application-specific**: Figma, Sketch, Adobe

Each platform has unique APIs and constraints.

## Architecture Pattern

**Extension Architecture**
Based on platform:

- **Browser**: Content scripts, background workers, popup UI
- **VS Code**: Extension host, language server, webview
- **IDE**: Plugin architecture, service providers
- **Application**: Native API, JavaScript bridge

Follow platform-specific patterns and guidelines.

## Manifest and Configuration

**Extension Declaration**

- Manifest version and compatibility
- Permission requirements
- Activation events
- Command registration
- Context menu integration

Request minimum necessary permissions for user trust.

## Communication Architecture

**Inter-Component Communication**

- Message passing between components
- Storage sync across instances
- Native messaging (if needed)
- WebSocket for external services

Design for async communication patterns.

## UI Integration

**User Interface Approach**

- **Popup/Panel**: For quick interactions
- **Sidebar**: For persistent tools
- **Content Injection**: Modify existing UI
- **Custom Pages**: Full page experiences
- **Statusbar**: For ambient information

Match UI to user workflow and platform conventions.

## State Management

**Data Persistence**

- Local storage for user preferences
- Sync storage for cross-device
- IndexedDB for large data
- File system access (if permitted)

Consider storage limits and sync conflicts.

## Performance Optimization

**Extension Performance**

- Lazy loading of features
- Minimal impact on host performance
- Efficient DOM manipulation
- Memory leak prevention
- Background task optimization

Extensions must not degrade host application performance.

## Security Considerations

**Extension Security**

- Content Security Policy
- Input sanitization
- Secure communication
- API key management
- User data protection

Follow platform security best practices.

## Development Workflow

**Development Tools**

- Hot reload during development
- Debugging setup
- Testing framework
- Build pipeline
- Version management

## Distribution Strategy

**Publishing and Updates**

- Official store submission
- Review process requirements
- Update mechanism
- Beta testing channel
- Self-hosting options

Plan for store review times and policies.

## API Integration

**External Service Communication**

- Authentication methods
- CORS handling
- Rate limiting
- Offline functionality
- Error handling

## Monetization

**Revenue Model** (if applicable)

- Free with premium features
- Subscription model
- One-time purchase
- Enterprise licensing

Consider platform policies on monetization.

## Testing Strategy

**Extension Testing**

- Unit tests for logic
- Integration tests with host API
- Cross-browser/platform testing
- Performance testing
- User acceptance testing

## Adaptive Guidance Examples

**For a Password Manager Extension:**
Focus on security, autofill integration, secure storage, and cross-browser sync.

**For a Developer Tool Extension:**
Emphasize debugging capabilities, performance profiling, and workspace integration.

**For a Content Blocker:**
Focus on performance, rule management, whitelist handling, and minimal overhead.

**For a Productivity Extension:**
Emphasize keyboard shortcuts, quick access, sync, and workflow integration.

## Key Principles

1. **Respect the host** - Don't break or slow down the host application
2. **Request minimal permissions** - Users are permission-aware
3. **Fast activation** - Extensions should load instantly
4. **Fail gracefully** - Handle API changes and errors
5. **Follow guidelines** - Store policies are strictly enforced

## Output Format

Document as:

- **Platform**: [Specific platform and version support]
- **Architecture**: [Component structure]
- **Permissions**: [Required permissions and justification]
- **Distribution**: [Store and update strategy]

Focus on platform-specific requirements and constraints.

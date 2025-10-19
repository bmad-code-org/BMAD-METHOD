# Desktop Application Architecture Instructions

## Intent-Based Technical Decision Guidance

<critical>
This is a STARTING POINT for desktop application architecture decisions.
The LLM should:
- Understand the application's purpose and target OS from requirements
- Balance native performance with development efficiency
- Consider distribution and update mechanisms
- Focus on desktop-specific UX patterns
- Plan for OS-specific integrations
</critical>

## Framework Selection

**Choose Based on Requirements and Team**

- **Electron**: Web technologies, cross-platform, rapid development
- **Tauri**: Rust + Web frontend, smaller binaries, better performance
- **Qt**: C++/Python, native performance, extensive widgets
- **.NET MAUI/WPF**: Windows-focused, C# teams
- **SwiftUI/AppKit**: Mac-only, native experience
- **JavaFX/Swing**: Java teams, enterprise apps
- **Flutter Desktop**: Dart, consistent cross-platform UI

Don't use Electron for performance-critical apps, or Qt for simple utilities.

## Architecture Pattern

**Application Structure**
Based on complexity:

- **MVC/MVVM**: For data-driven applications
- **Component-Based**: For complex UIs
- **Plugin Architecture**: For extensible apps
- **Document-Based**: For editors/creators

Match pattern to application type and team experience.

## Native Integration

**OS-Specific Features**
Based on requirements:

- System tray/menu bar integration
- File associations and protocol handlers
- Native notifications
- OS-specific shortcuts and gestures
- Dark mode and theme detection
- Native menus and dialogs

Plan for platform differences in UX expectations.

## Data Management

**Local Data Strategy**

- **SQLite**: For structured data
- **LevelDB/RocksDB**: For key-value storage
- **JSON/XML files**: For simple configuration
- **OS-specific stores**: Windows Registry, macOS Defaults

**Settings and Preferences**

- User vs. application settings
- Portable vs. installed mode
- Settings sync across devices

## Window Management

**Multi-Window Strategy**

- Single vs. multi-window architecture
- Window state persistence
- Multi-monitor support
- Workspace/session management

## Performance Optimization

**Desktop Performance**

- Startup time optimization
- Memory usage monitoring
- Background task management
- GPU acceleration usage
- Native vs. web rendering trade-offs

## Update Mechanism

**Application Updates**

- **Auto-update**: Electron-updater, Sparkle, Squirrel
- **Store-based**: Mac App Store, Microsoft Store
- **Manual**: Download from website
- **Package manager**: Homebrew, Chocolatey, APT/YUM

Consider code signing and notarization requirements.

## Security Considerations

**Desktop Security**

- Code signing certificates
- Secure storage for credentials
- Process isolation
- Network security
- Input validation
- Automatic security updates

## Distribution Strategy

**Packaging and Installation**

- **Installers**: MSI, DMG, DEB/RPM
- **Portable**: Single executable
- **App stores**: Platform stores
- **Package managers**: OS-specific

Consider installation permissions and user experience.

## IPC and Extensions

**Inter-Process Communication**

- Main/renderer process communication (Electron)
- Plugin/extension system
- CLI integration
- Automation/scripting support

## Accessibility

**Desktop Accessibility**

- Screen reader support
- Keyboard navigation
- High contrast themes
- Zoom/scaling support
- OS accessibility APIs

## Testing Strategy

**Desktop Testing**

- Unit tests for business logic
- Integration tests for OS interactions
- UI automation testing
- Multi-OS testing matrix
- Performance profiling

## Adaptive Guidance Examples

**For a Development IDE:**
Focus on performance, plugin system, workspace management, and syntax highlighting.

**For a Media Player:**
Emphasize codec support, hardware acceleration, media keys, and playlist management.

**For a Business Application:**
Focus on data grids, reporting, printing, and enterprise integration.

**For a Creative Tool:**
Emphasize canvas rendering, tool palettes, undo/redo, and file format support.

## Key Principles

1. **Respect platform conventions** - Mac != Windows != Linux
2. **Optimize startup time** - Desktop users expect instant launch
3. **Handle offline gracefully** - Desktop != always online
4. **Integrate with OS** - Use native features appropriately
5. **Plan distribution early** - Signing/notarization takes time

## Output Format

Document as:

- **Framework**: [Specific framework and version]
- **Target OS**: [Primary and secondary platforms]
- **Distribution**: [How users will install]
- **Update strategy**: [How updates are delivered]

Focus on desktop-specific architectural decisions.

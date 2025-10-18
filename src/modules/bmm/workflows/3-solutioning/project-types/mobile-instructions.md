# Mobile Application Architecture Instructions

## Intent-Based Technical Decision Guidance

<critical>
This is a STARTING POINT for mobile app architecture decisions.
The LLM should:
- Understand platform requirements from the PRD (iOS, Android, or both)
- Guide framework choice based on team expertise and project needs
- Focus on mobile-specific concerns (offline, performance, battery)
- Adapt complexity to project scale and team size
- Keep decisions concrete and implementation-focused
</critical>

## Platform Strategy

**Determine the Right Approach**
Analyze requirements to recommend:

- **Native** (Swift/Kotlin): When platform-specific features and performance are critical
- **Cross-platform** (React Native/Flutter): For faster development across platforms
- **Hybrid** (Ionic/Capacitor): When web expertise exists and native features are minimal
- **PWA**: For simple apps with basic device access needs

Consider team expertise heavily - don't suggest Flutter to an iOS team unless there's strong justification.

## Framework and Technology Selection

**Match Framework to Project Needs**
Based on the requirements and team:

- **React Native**: JavaScript teams, code sharing with web, large ecosystem
- **Flutter**: Consistent UI across platforms, high performance animations
- **Native**: Platform-specific UX, maximum performance, full API access
- **.NET MAUI**: C# teams, enterprise environments

For beginners: Recommend based on existing web experience.
For experts: Focus on specific trade-offs relevant to their use case.

## Application Architecture

**Architectural Pattern**
Guide toward appropriate patterns:

- **MVVM/MVP**: For testability and separation of concerns
- **Redux/MobX**: For complex state management
- **Clean Architecture**: For larger teams and long-term maintenance

Don't over-architect simple apps - a basic MVC might suffice for simple utilities.

## Data Management

**Local Storage Strategy**
Based on data requirements:

- **SQLite**: Structured data, complex queries, offline-first apps
- **Realm**: Object database for simpler data models
- **AsyncStorage/SharedPreferences**: Simple key-value storage
- **Core Data**: iOS-specific with iCloud sync

**Sync and Offline Strategy**
Only if offline capability is required:

- Conflict resolution approach
- Sync triggers and frequency
- Data compression and optimization

## API Communication

**Network Layer Design**

- RESTful APIs for simple CRUD operations
- GraphQL for complex data requirements
- WebSocket for real-time features
- Consider bandwidth optimization for mobile networks

**Security Considerations**

- Certificate pinning for sensitive apps
- Token storage in secure keychain
- Biometric authentication integration

## UI/UX Architecture

**Design System Approach**

- Platform-specific (Material Design, Human Interface Guidelines)
- Custom design system for brand consistency
- Component library selection

**Navigation Pattern**
Based on app complexity:

- Tab-based for simple apps with clear sections
- Drawer navigation for many features
- Stack navigation for linear flows
- Hybrid for complex apps

## Performance Optimization

**Mobile-Specific Performance**
Focus on what matters for mobile:

- App size (consider app thinning, dynamic delivery)
- Startup time optimization
- Memory management
- Battery efficiency
- Network optimization

Only dive deep into performance if the PRD indicates performance-critical requirements.

## Native Features Integration

**Device Capabilities**
Based on PRD requirements, plan for:

- Camera/Gallery access patterns
- Location services and geofencing
- Push notifications architecture
- Biometric authentication
- Payment integration (Apple Pay, Google Pay)

Don't list all possible features - focus on what's actually needed.

## Testing Strategy

**Mobile Testing Approach**

- Unit testing for business logic
- UI testing for critical flows
- Device testing matrix (OS versions, screen sizes)
- Beta testing distribution (TestFlight, Play Console)

Scale testing complexity to project risk and team size.

## Distribution and Updates

**App Store Strategy**

- Release cadence and versioning
- Update mechanisms (CodePush for React Native, OTA updates)
- A/B testing and feature flags
- Crash reporting and analytics

**Compliance and Guidelines**

- App Store/Play Store guidelines
- Privacy requirements (ATT, data collection)
- Content ratings and age restrictions

## Adaptive Guidance Examples

**For a Social Media App:**
Focus on real-time updates, media handling, offline caching, and push notification strategy.

**For an Enterprise App:**
Emphasize security, MDM integration, SSO, and offline data sync.

**For a Gaming App:**
Focus on performance, graphics framework, monetization, and social features.

**For a Utility App:**
Keep it simple - basic UI, minimal backend, focus on core functionality.

## Key Principles

1. **Platform conventions matter** - Don't fight the platform
2. **Performance is felt immediately** - Mobile users are sensitive to lag
3. **Offline-first when appropriate** - But don't over-engineer
4. **Test on real devices** - Simulators hide real issues
5. **Plan for app store review** - Build in buffer time

## Output Format

Document decisions as:

- **Technology**: [Specific framework/library with version]
- **Justification**: [Why this fits the requirements]
- **Platform-specific notes**: [iOS/Android differences if applicable]

Keep mobile-specific considerations prominent in the architecture document.

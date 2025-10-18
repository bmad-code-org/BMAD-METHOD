# Embedded/IoT System Architecture Instructions

## Intent-Based Technical Decision Guidance

<critical>
This is a STARTING POINT for embedded/IoT architecture decisions.
The LLM should:
- Understand hardware constraints and real-time requirements
- Guide platform and RTOS selection based on use case
- Consider power consumption and resource limitations
- Balance features with memory/processing constraints
- Focus on reliability and update mechanisms
</critical>

## Hardware Platform Selection

**Choose Based on Requirements**

- **Microcontroller**: For simple, low-power, real-time tasks
- **SoC/SBC**: For complex processing, Linux-capable
- **FPGA**: For parallel processing, custom logic
- **Hybrid**: MCU + application processor

Consider power budget, processing needs, and peripheral requirements.

## Operating System/RTOS

**OS Selection**
Based on complexity:

- **Bare Metal**: Simple control loops, minimal overhead
- **RTOS**: FreeRTOS, Zephyr for real-time requirements
- **Embedded Linux**: Complex applications, networking
- **Android Things/Windows IoT**: For specific ecosystems

Don't use Linux for battery-powered sensors, or bare metal for complex networking.

## Development Framework

**Language and Tools**

- **C/C++**: Maximum control, minimal overhead
- **Rust**: Memory safety, modern tooling
- **MicroPython/CircuitPython**: Rapid prototyping
- **Arduino**: Beginner-friendly, large community
- **Platform-specific SDKs**: ESP-IDF, STM32Cube

Match to team expertise and performance requirements.

## Communication Protocols

**Connectivity Strategy**
Based on use case:

- **Local**: I2C, SPI, UART for sensor communication
- **Wireless**: WiFi, Bluetooth, LoRa, Zigbee, cellular
- **Industrial**: Modbus, CAN bus, MQTT
- **Cloud**: HTTPS, MQTT, CoAP

Consider range, power consumption, and data rates.

## Power Management

**Power Optimization**

- Sleep modes and wake triggers
- Dynamic frequency scaling
- Peripheral power management
- Battery monitoring and management
- Energy harvesting considerations

Critical for battery-powered devices.

## Memory Architecture

**Memory Management**

- Static vs. dynamic allocation
- Flash wear leveling
- RAM optimization techniques
- External storage options
- Bootloader and OTA partitioning

Plan memory layout early - hard to change later.

## Firmware Architecture

**Code Organization**

- HAL (Hardware Abstraction Layer)
- Modular driver architecture
- Task/thread design
- Interrupt handling strategy
- State machine implementation

## Update Mechanism

**OTA Updates**

- Update delivery method
- Rollback capability
- Differential updates
- Security and signing
- Factory reset capability

Plan for field updates from day one.

## Security Architecture

**Embedded Security**

- Secure boot
- Encrypted storage
- Secure communication (TLS)
- Hardware security modules
- Attack surface minimization

Security is harder to add later.

## Data Management

**Local and Cloud Data**

- Edge processing vs. cloud processing
- Local storage and buffering
- Data compression
- Time synchronization
- Offline operation handling

## Testing Strategy

**Embedded Testing**

- Unit testing on host
- Hardware-in-the-loop testing
- Integration testing
- Environmental testing
- Certification requirements

## Debugging and Monitoring

**Development Tools**

- Debug interfaces (JTAG, SWD)
- Serial console
- Logic analyzers
- Remote debugging
- Field diagnostics

## Production Considerations

**Manufacturing and Deployment**

- Provisioning process
- Calibration requirements
- Production testing
- Device identification
- Configuration management

## Adaptive Guidance Examples

**For a Smart Sensor:**
Focus on ultra-low power, wireless communication, and edge processing.

**For an Industrial Controller:**
Emphasize real-time performance, reliability, safety systems, and industrial protocols.

**For a Consumer IoT Device:**
Focus on user experience, cloud integration, OTA updates, and cost optimization.

**For a Wearable:**
Emphasize power efficiency, small form factor, BLE, and sensor fusion.

## Key Principles

1. **Design for constraints** - Memory, power, and processing are limited
2. **Plan for failure** - Hardware fails, design for recovery
3. **Security from the start** - Retrofitting is difficult
4. **Test on real hardware** - Simulation has limits
5. **Design for production** - Prototype != product

## Output Format

Document as:

- **Platform**: [MCU/SoC selection with part numbers]
- **OS/RTOS**: [Operating system choice]
- **Connectivity**: [Communication protocols and interfaces]
- **Power**: [Power budget and management strategy]

Focus on hardware/software co-design decisions.

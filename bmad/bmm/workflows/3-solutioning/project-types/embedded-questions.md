# Embedded System Architecture Questions

## Hardware Platform

1. **Microcontroller/SoC:**
   - ESP32 (WiFi/BLE, popular)
   - ESP8266 (WiFi, budget)
   - STM32 (ARM Cortex-M, powerful)
   - Arduino (AVR, beginner-friendly)
   - Raspberry Pi Pico (RP2040)
   - Other: **\_\_\_**

2. **RTOS or Bare Metal:**
   - FreeRTOS (popular, tasks/queues)
   - Zephyr RTOS
   - Bare metal (no OS, full control)
   - Arduino framework
   - ESP-IDF
   - Other: **\_\_\_**

3. **Programming language:**
   - C
   - C++
   - MicroPython
   - Arduino (C++)
   - Rust

## Communication

4. **Primary communication protocol:**
   - MQTT (IoT messaging)
   - HTTP/HTTPS (REST APIs)
   - WebSockets
   - CoAP
   - Custom binary protocol

5. **Local communication (peripherals):**
   - UART (serial)
   - I2C (sensors)
   - SPI (high-speed devices)
   - GPIO (simple digital)
   - Analog (ADC)

6. **Wireless connectivity:**
   - WiFi
   - Bluetooth Classic
   - BLE (Bluetooth Low Energy)
   - LoRa/LoRaWAN
   - Zigbee
   - None (wired only)

## Cloud/Backend

7. **Cloud platform:** (if IoT project)
   - AWS IoT Core
   - Azure IoT Hub
   - Google Cloud IoT
   - Custom MQTT broker
   - ThingsBoard
   - None (local only)

## Power

8. **Power source:**
   - USB powered (5V constant)
   - Battery (need power management)
   - AC adapter
   - Solar
   - Other: **\_\_\_**

9. **Low power mode needed:**
   - Yes (battery-powered, deep sleep)
   - No (always powered)

## Storage

10. **Data persistence:**
    - EEPROM (small config)
    - Flash (larger data)
    - SD card
    - None needed
    - Cloud only

## Updates

11. **Firmware update strategy:**
    - OTA (Over-The-Air via WiFi)
    - USB/Serial upload
    - SD card
    - No updates (fixed firmware)

## Sensors/Actuators

12. **Sensors used:** (list)
    - Temperature (DHT22, DS18B20, etc.)
    - Humidity
    - Motion (PIR, accelerometer)
    - Light (LDR, photodiode)
    - Other: **\_\_\_**

13. **Actuators used:** (list)
    - LEDs
    - Motors (DC, servo, stepper)
    - Relays
    - Display (LCD, OLED)
    - Other: **\_\_\_**

## Real-Time Constraints

14. **Hard real-time requirements:**
    - Yes (must respond within X ms, critical)
    - Soft real-time (best effort)
    - No timing constraints

15. **Interrupt-driven or polling:**
    - Interrupts (responsive)
    - Polling (simpler)
    - Mix
